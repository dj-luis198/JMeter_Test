/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.18969555035129, "KoPercent": 2.810304449648712};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7598137059214903, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47945f8f-dffd-4357-bf0a-df142cae3db1"], "isController": false}, {"data": [0.09259259259259259, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e300e16c-863a-4f36-97f8-ce1a07b1417f"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/edc907e3-0f37-4c90-adad-5e00e00e9882"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9c0af44-8eac-4e01-b775-4d042b63d69f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/15747697-5c27-4883-acc3-5c80bf989979"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67c0d90f-e0ea-4f78-aae2-49fdea013d27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af35b0e9-db0d-4ce0-a14b-e165e77a3428"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b849ae4-879d-4041-9f76-4aadf5de1aae"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0625, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eed216e1-adc5-4ab7-bd36-d5230d941ce6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/23800902-d59a-407a-be4e-d1518beabc3a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47945f8f-dffd-4357-bf0a-df142cae3db1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2041a81-2631-4b5a-ad21-b582d25a45ba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=543ea4fb-8066-4c4f-8445-5a667d100a04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc4c8873-12d2-401e-9ec2-2e2b7473f5b6"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4074074074074074, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb0c49d3-8327-49a9-9ac9-7b15853eade3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8844c44-1dae-43d3-ab4f-ea556ac89cab"], "isController": false}, {"data": [0.2, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67c0d90f-e0ea-4f78-aae2-49fdea013d27"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15747697-5c27-4883-acc3-5c80bf989979"], "isController": false}, {"data": [0.8658536585365854, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af35b0e9-db0d-4ce0-a14b-e165e77a3428"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23800902-d59a-407a-be4e-d1518beabc3a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8844c44-1dae-43d3-ab4f-ea556ac89cab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2041a81-2631-4b5a-ad21-b582d25a45ba"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9c0af44-8eac-4e01-b775-4d042b63d69f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edc907e3-0f37-4c90-adad-5e00e00e9882"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/123f908a-4193-4a13-af43-00b0d52f377c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eed216e1-adc5-4ab7-bd36-d5230d941ce6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc4c8873-12d2-401e-9ec2-2e2b7473f5b6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b849ae4-879d-4041-9f76-4aadf5de1aae"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e300e16c-863a-4f36-97f8-ce1a07b1417f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/543ea4fb-8066-4c4f-8445-5a667d100a04"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1281, 36, 2.810304449648712, 380.73536299765794, 92, 6883, 111.0, 1054.3999999999999, 1261.8999999999999, 1824.880000000001, 4.995671198259119, 712.3780879273229, 3.6456665245669244], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47945f8f-dffd-4357-bf0a-df142cae3db1", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1742.185185185185, 1212, 2443, 1725.5, 2208.0, 2353.75, 2443.0, 0.23837797034401473, 286.8484852790567, 1.1721026178536271], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e300e16c-863a-4f36-97f8-ce1a07b1417f", 1, 0, 0.0, 1684.0, 1684, 1684, 1684.0, 1684.0, 1684.0, 1684.0, 0.5938242280285035, 0.10728269744655582, 0.4094139697149644], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 687.375, 103, 1773, 496.0, 1581.9, 1773.0, 1773.0, 0.07881734572736095, 0.015365149063305106, 0.05309972303092103], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 687.375, 103, 1773, 496.0, 1581.9, 1773.0, 1773.0, 0.080423429355557, 0.015678249106545965, 0.05418175129557118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 123.4444444444445, 93, 305, 102.0, 303.2, 305.0, 305.0, 0.10536359219606993, 0.03698472447420641, 0.05959856837219104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 114.33333333333331, 98, 308, 103.0, 129.8000000000003, 308.0, 308.0, 0.10535804174519743, 0.0782983103204055, 0.0528847982978823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 162.72222222222223, 96, 798, 102.0, 352.5000000000007, 798.0, 798.0, 0.10536667603259342, 1.7480052588215322, 0.06154392546478412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 206.11111111111106, 95, 1784, 101.5, 449.3000000000021, 1784.0, 1784.0, 0.10536667603259342, 5.293995206182097, 0.06144102832022104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/edc907e3-0f37-4c90-adad-5e00e00e9882", 3, 0, 0.0, 272.0, 193, 424, 199.0, 424.0, 424.0, 424.0, 0.021092151610385777, 0.02493020914626001, 0.013525891494941399], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 357.0, 101, 1309, 227.0, 1134.7000000000003, 1309.0, 1309.0, 0.07941116620260767, 0.1202315300794608, 0.0513283844046396], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e9c0af44-8eac-4e01-b775-4d042b63d69f", 3, 0, 0.0, 358.6666666666667, 235, 443, 398.0, 443.0, 443.0, 443.0, 0.07170343459451707, 0.03323752957766677, 0.045981694710676646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15747697-5c27-4883-acc3-5c80bf989979", 3, 0, 0.0, 634.6666666666666, 224, 1060, 620.0, 1060.0, 1060.0, 1060.0, 0.04533571093950705, 0.028201999871548818, 0.02907270525743128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 105.22222222222221, 94, 155, 102.5, 119.90000000000006, 155.0, 155.0, 0.11377930607265441, 0.08455669132938477, 0.05711187824350036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 150.83333333333334, 96, 335, 102.0, 328.7, 335.0, 335.0, 0.1137836214798192, 0.04943463763077215, 0.06383043869907393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 716.875, 481, 803, 779.5, 803.0, 803.0, 803.0, 0.0687811127064508, 20.223930883579367, 0.039226728340397726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1063.0, 846, 1256, 1071.5, 1256.0, 1256.0, 1256.0, 0.06865891965189928, 61.77941659228617, 0.039089990387751246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 204.875, 95, 323, 203.5, 323.0, 323.0, 323.0, 0.06905242805600152, 0.12219042933347143, 0.038235084675539904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67c0d90f-e0ea-4f78-aae2-49fdea013d27", 3, 0, 0.0, 308.0, 204, 510, 210.0, 510.0, 510.0, 510.0, 0.04439511653718091, 0.028541782278949313, 0.028469524602293746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 159.57142857142858, 98, 304, 102.0, 304.0, 304.0, 304.0, 0.10445266801957742, 0.07762546910439297, 0.05243034312701444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 102.99999999999999, 100, 108, 102.0, 108.0, 108.0, 108.0, 0.10476062197877849, 0.028031650802915337, 0.0597462922222721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 211.57142857142856, 96, 307, 287.0, 307.0, 307.0, 307.0, 0.10446357951916907, 0.028156199167276037, 0.0614131590532615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 187.0, 100, 305, 101.0, 305.0, 305.0, 305.0, 0.10445890288306572, 0.02815493866770131, 0.06151242035008655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 148.5, 98, 292, 101.5, 292.0, 292.0, 292.0, 0.0691730363504306, 0.05140691470964618, 0.038842281153806245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 892.6428571428571, 96, 1367, 1179.0, 1314.0, 1367.0, 1367.0, 0.0891827673412706, 57.32601845525892, 0.04695532421121028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 211.00000000000003, 96, 1085, 102.0, 909.5000000000002, 1085.0, 1085.0, 0.11378290222255937, 11.403044423531568, 0.06580543281751751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 554.2857142857144, 100, 861, 669.0, 855.0, 861.0, 861.0, 0.08929938255855488, 18.76186505747053, 0.047103929332295756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 177.88888888888889, 92, 765, 102.5, 626.4000000000002, 765.0, 765.0, 0.1137836214798192, 3.7446120689655173, 0.06591696561206106], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 520.25, 103, 1684, 470.0, 1088.3000000000006, 1684.0, 1684.0, 0.0806939681258826, 0.01573098963586847, 0.05491563382590276], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/af35b0e9-db0d-4ce0-a14b-e165e77a3428", 3, 0, 0.0, 333.0, 195, 609, 195.0, 609.0, 609.0, 609.0, 0.08028474322262959, 0.0372153236813231, 0.05148468234003265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 377.42857142857144, 200, 607, 410.0, 607.0, 607.0, 607.0, 0.10398562027422494, 0.16115740173358886, 0.23386609715970708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b849ae4-879d-4041-9f76-4aadf5de1aae", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 887.7916666666669, 130, 6276, 497.5, 2330.5, 5556.75, 6276.0, 0.10216330804791458, 0.06275461011927566, 0.046192980103695755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 102.42857142857143, 96, 128, 101.5, 116.0, 128.0, 128.0, 0.08929710422247734, 0.06636239874346217, 0.044822960517923206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 209.21428571428575, 97, 409, 196.5, 358.5, 409.0, 409.0, 0.08918333545674609, 0.11954150210217863, 0.04551236622499682], "isController": false}, {"data": ["login", 24, 0, 0.0, 2847.25, 1367, 7335, 2718.5, 4478.5, 6827.0, 7335.0, 0.10273488834001825, 41.10703129347505, 0.21179038016189308], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eed216e1-adc5-4ab7-bd36-d5230d941ce6", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 117.38888888888889, 98, 314, 105.0, 131.3000000000003, 314.0, 314.0, 0.11655539942887855, 0.09435979113919953, 0.04143180214073417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1011.5714285714288, 203, 1465, 1280.5, 1414.5, 1465.0, 1465.0, 0.08912315546897878, 76.1982339689724, 0.18415221200488902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23800902-d59a-407a-be4e-d1518beabc3a", 3, 0, 0.0, 516.6666666666666, 339, 833, 378.0, 833.0, 833.0, 833.0, 0.032847554499567506, 0.027383654646286584, 0.021064349727912757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47945f8f-dffd-4357-bf0a-df142cae3db1", 3, 0, 0.0, 387.0, 209, 639, 313.0, 639.0, 639.0, 639.0, 0.04110771591827786, 0.026428300435741788, 0.02636139334603105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 356.38888888888897, 200, 1886, 208.5, 738.5000000000018, 1886.0, 1886.0, 0.10529517748087137, 7.152434283744179, 0.2353146132157147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 842.0000000000001, 101, 1362, 1120.0, 1355.7, 1362.0, 1362.0, 0.10216765712534269, 81.49447070768132, 0.17614941274882082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2041a81-2631-4b5a-ad21-b582d25a45ba", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=543ea4fb-8066-4c4f-8445-5a667d100a04", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 0.2562610815602837, 0.9779476950354611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc4c8873-12d2-401e-9ec2-2e2b7473f5b6", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.9078596105527638, 3.4645885678391957], "isController": false}, {"data": ["register", 25, 8, 32.0, 1012.5999999999998, 132, 6883, 752.0, 1805.4000000000005, 5412.099999999997, 6883.0, 0.09894250253292806, 0.03096591133960233, 0.0446400743849734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 105.0, 101, 118, 104.0, 113.2, 118.0, 118.0, 0.07436160561578845, 0.05773191060991389, 0.0264332269962373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 354.6111111111111, 197, 1202, 211.5, 1013.0000000000003, 1202.0, 1202.0, 0.11370671248626045, 15.271393838991296, 0.2524965137837804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 349.82352941176464, 199, 1250, 208.0, 748.3999999999995, 1250.0, 1250.0, 0.08919155723212364, 6.4068107263340695, 0.19925152051930473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 120.33333333333333, 97, 315, 102.5, 253.20000000000022, 315.0, 315.0, 0.05825412390652154, 0.04329237137974892, 0.0292408395390157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 117.58333333333333, 96, 300, 101.0, 242.1000000000002, 300.0, 300.0, 0.058252992747502404, 0.015587226575015291, 0.03322240992630997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 134.16666666666669, 96, 306, 101.0, 305.1, 306.0, 306.0, 0.05825638635635432, 0.015701916635111123, 0.034248383385278615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 133.66666666666666, 96, 302, 102.0, 300.5, 302.0, 302.0, 0.058254972304615245, 0.015701535503978327, 0.03430444169890917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 103.5, 103, 104, 103.5, 104.0, 104.0, 104.0, 0.03277345350266284, 0.009665608357230644, 0.02025937115936092], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1208.5555555555554, 800, 1999, 1147.5, 1679.5, 1839.75, 1999.0, 0.23807844243792325, 284.82458661426, 0.4701119244233211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1012.5999999999998, 132, 6883, 752.0, 1805.4000000000005, 5412.099999999997, 6883.0, 0.09880134211743133, 0.030921732540814838, 0.04457638677563796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 159.75, 98, 320, 103.5, 320.0, 320.0, 320.0, 0.047201260273649306, 0.01272221468313204, 0.02779527338379935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 133.625, 96, 297, 102.0, 297.0, 297.0, 297.0, 0.04726205034589913, 0.012738599507293124, 0.027784916316632106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 141.20000000000002, 97, 307, 102.0, 306.4, 307.0, 307.0, 0.07315645727662895, 0.019717951375341398, 0.043007995391143194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 155.26666666666668, 97, 412, 102.0, 407.8, 412.0, 412.0, 0.07315395982384526, 0.019717278233770796, 0.04307796657595576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 143.53333333333333, 98, 390, 103.0, 337.8, 390.0, 390.0, 0.07315395982384526, 0.054365393970650634, 0.03671985873970358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 109.0, 99, 167, 101.0, 167.0, 167.0, 167.0, 0.047262329560224026, 0.012646365526856818, 0.026954297327315264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 142.6, 100, 310, 103.0, 304.6, 310.0, 310.0, 0.07315360305879598, 0.019574303943466896, 0.04172041424446959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 108.5, 98, 161, 102.0, 161.0, 161.0, 161.0, 0.047245582538032696, 0.03511121905414344, 0.023715067797410942], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 577.1874999999998, 101, 1451, 559.5, 1027.5000000000005, 1451.0, 1451.0, 0.08161766206207023, 0.015632093722581567, 0.05554424633740741], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 113.0, 101, 158, 105.5, 158.0, 158.0, 158.0, 0.04474998741406604, 0.03522313462474339, 0.015907222088593787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1167.25, 769, 2966, 1007.5, 1755.0, 2680.0, 2966.0, 0.10244502117197103, 0.05302330197377408, 0.04712070798046715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 272.25, 202, 424, 207.0, 424.0, 424.0, 424.0, 0.04715590922487475, 0.07308244916003537, 0.10605474506336575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb0c49d3-8327-49a9-9ac9-7b15853eade3", 1, 0, 0.0, 2152.0, 2152, 2152, 2152.0, 2152.0, 2152.0, 2152.0, 0.4646840148698885, 0.14839030552973978, 0.2772675127788104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8844c44-1dae-43d3-ab4f-ea556ac89cab", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["addBook", 55, 20, 36.36363636363637, 1051.3272727272727, 509, 4035, 805.0, 1961.2, 2182.399999999998, 4035.0, 0.25302014040317605, 78.09250542124403, 0.9174406063972692], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 175.09259259259258, 98, 412, 103.0, 403.5, 411.25, 412.0, 0.239082983932738, 0.1776778816140758, 0.11557234086592315], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 672.962962962963, 458, 909, 606.0, 884.0, 899.0, 909.0, 0.2389655447086833, 70.26380454720454, 0.12018286672360537], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 148.31481481481475, 93, 416, 103.0, 304.0, 308.25, 416.0, 0.23943068703305476, 0.42368008291396014, 0.11644187709224732], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1028.3888888888891, 692, 1732, 1008.5, 1303.5, 1590.0, 1732.0, 0.23852854391575523, 214.62840310385266, 0.11973014802021309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 122.94117647058822, 100, 420, 104.0, 172.79999999999978, 420.0, 420.0, 0.08414841800974142, 0.06286478493891814, 0.02991213296440027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67c0d90f-e0ea-4f78-aae2-49fdea013d27", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15747697-5c27-4883-acc3-5c80bf989979", 1, 0, 0.0, 833.0, 833, 833, 833.0, 833.0, 833.0, 833.0, 1.2004801920768307, 0.21688362845138057, 0.8276748199279712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 20, 12.195121951219512, 165.609756097561, 95, 1938, 105.0, 295.0, 398.75, 1380.2999999999952, 0.6679047339784316, 1.509685986778337, 0.3176978018705405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 177.66666666666666, 102, 372, 106.5, 356.1000000000001, 372.0, 372.0, 0.05842742583368633, 0.04524702020128248, 0.020769124026818186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af35b0e9-db0d-4ce0-a14b-e165e77a3428", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 115.61111111111111, 102, 303, 104.0, 127.50000000000028, 303.0, 303.0, 0.10339717151293039, 0.08390922805395035, 0.036754463311236975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23800902-d59a-407a-be4e-d1518beabc3a", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8844c44-1dae-43d3-ab4f-ea556ac89cab", 3, 0, 0.0, 406.33333333333337, 216, 710, 293.0, 710.0, 710.0, 710.0, 0.02088831020533209, 0.02468927550636745, 0.013395172885580798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2041a81-2631-4b5a-ad21-b582d25a45ba", 3, 0, 0.0, 343.0, 265, 428, 336.0, 428.0, 428.0, 428.0, 0.029824038174768867, 0.024241739362759716, 0.019125441147231335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 273.6666666666667, 197, 615, 207.5, 555.0000000000002, 615.0, 615.0, 0.05822359802427924, 0.0902352051411437, 0.1309462365721827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 341.7333333333333, 202, 701, 210.0, 646.4000000000001, 701.0, 701.0, 0.0731158056874348, 0.11331521838472562, 0.16443916064273667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9c0af44-8eac-4e01-b775-4d042b63d69f", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edc907e3-0f37-4c90-adad-5e00e00e9882", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/123f908a-4193-4a13-af43-00b0d52f377c", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.7357970910138248, 1.3748379896313365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 103.0, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.09989154632113705, 0.08282023713539587, 0.03550832310634169], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eed216e1-adc5-4ab7-bd36-d5230d941ce6", 3, 0, 0.0, 592.6666666666666, 207, 1134, 437.0, 1134.0, 1134.0, 1134.0, 0.046557824818424486, 0.029932195317834746, 0.029856417608169344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 123.28571428571428, 100, 320, 105.0, 229.5, 320.0, 320.0, 0.08798225272273649, 0.06830653409626515, 0.03127494139753524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc4c8873-12d2-401e-9ec2-2e2b7473f5b6", 3, 0, 0.0, 695.3333333333333, 262, 1451, 373.0, 1451.0, 1451.0, 1451.0, 0.06705558908335009, 0.030340907820916876, 0.0430011427389973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b849ae4-879d-4041-9f76-4aadf5de1aae", 3, 0, 0.0, 370.0, 219, 633, 258.0, 633.0, 633.0, 633.0, 0.03827018752391887, 0.03838230721393035, 0.02454175436917974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e300e16c-863a-4f36-97f8-ce1a07b1417f", 3, 0, 0.0, 1102.3333333333333, 337, 2124, 846.0, 2124.0, 2124.0, 2124.0, 0.06517205422314912, 0.029488657347062915, 0.04179327695950644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 113.05882352941177, 97, 304, 101.0, 144.79999999999984, 304.0, 304.0, 0.08923884514435695, 0.06631910269028872, 0.04479371719160105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 161.05882352941177, 95, 308, 102.0, 305.6, 308.0, 308.0, 0.08924212438252324, 0.03176379840729056, 0.050455020000734936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 209.64705882352945, 95, 1148, 101.0, 483.99999999999943, 1148.0, 1148.0, 0.08924071896522762, 4.746106258464745, 0.052012657089912644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/543ea4fb-8066-4c4f-8445-5a667d100a04", 3, 0, 0.0, 770.3333333333334, 450, 1309, 552.0, 1309.0, 1309.0, 1309.0, 0.02822519945807617, 0.023530187438845402, 0.018100144183727233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 153.23529411764707, 97, 800, 101.0, 401.5999999999997, 800.0, 800.0, 0.08924118743274102, 1.566160283078296, 0.052100079726502005], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.22222222222222, 0.624512099921936], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.555555555555555, 0.156128024980484], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.555555555555555, 0.156128024980484], "isController": false}, {"data": ["401/Unauthorized", 24, 66.66666666666667, 1.873536299765808], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1281, 36, "401/Unauthorized", 24, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
