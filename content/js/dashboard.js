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

    var data = {"OkPercent": 98.25227963525836, "KoPercent": 1.7477203647416413};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7669270833333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd000354-784e-4a55-8b06-8c808518a340"], "isController": false}, {"data": [0.11403508771929824, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fcb5fbdb-131b-480b-9ae2-a0a313a285e9"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f63ee511-ff12-4ba5-bc56-6a6b030e0742"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f84ca3e3-4758-44d4-b88b-b34df56a110e"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16c4b15a-67b0-4a2a-b564-ec2b99c42c70"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3a9b3138-647d-482a-8864-25348e44f9f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=259327ae-e6e3-4cdf-bdc7-0f8f55df98a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5893d336-7264-477d-8df8-aad52142416e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f87181f3-9946-492e-b4fd-3f2991ea58ce"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0055782c-f2ff-49cd-b8f6-28286ec4bf26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9d3e743-7d01-4615-aee7-9a3a792d28a5"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/66d87517-1a13-42a1-bc4a-8668aa912095"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6114ae8f-7467-4bf2-b783-1aa7c69ea139"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64a4a5bd-182c-4e49-b099-97b513ab92bd"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a7167da-8bad-440b-9be2-be23211a972b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fcb5fbdb-131b-480b-9ae2-a0a313a285e9"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0055782c-f2ff-49cd-b8f6-28286ec4bf26"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/259327ae-e6e3-4cdf-bdc7-0f8f55df98a1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f63ee511-ff12-4ba5-bc56-6a6b030e0742"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9d3e743-7d01-4615-aee7-9a3a792d28a5"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f87181f3-9946-492e-b4fd-3f2991ea58ce"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5893d336-7264-477d-8df8-aad52142416e"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a181102a-3271-4012-b82a-b2e3c7a36acb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5087719298245614, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.935672514619883, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd000354-784e-4a55-8b06-8c808518a340"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66d87517-1a13-42a1-bc4a-8668aa912095"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a181102a-3271-4012-b82a-b2e3c7a36acb"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16c4b15a-67b0-4a2a-b564-ec2b99c42c70"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64a4a5bd-182c-4e49-b099-97b513ab92bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3b97bad-c493-43fe-b332-9dd1a8adc09d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6114ae8f-7467-4bf2-b783-1aa7c69ea139"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 23, 1.7477203647416413, 381.11778115501534, 100, 2708, 125.0, 1035.4999999999984, 1300.1499999999999, 1807.5999999999985, 5.19823196912661, 759.4304438370733, 3.791911455021073], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd000354-784e-4a55-8b06-8c808518a340", 1, 0, 0.0, 2018.0, 2018, 2018, 2018.0, 2018.0, 2018.0, 2018.0, 0.4955401387512388, 0.0895262945986125, 0.34165169722497524], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1701.1052631578943, 1236, 2252, 1650.0, 2064.8, 2182.5, 2252.0, 0.2632259494606177, 316.7493438833447, 1.294279937045127], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fcb5fbdb-131b-480b-9ae2-a0a313a285e9", 3, 0, 0.0, 489.66666666666663, 216, 887, 366.0, 887.0, 887.0, 887.0, 0.05898081157596729, 0.03791897879639824, 0.03782298138172382], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 656.1999999999999, 106, 1811, 476.0, 1533.8000000000002, 1811.0, 1811.0, 0.0836862101862855, 0.016393997815789912, 0.0563465355303753], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 656.1999999999999, 106, 1811, 476.0, 1533.8000000000002, 1811.0, 1811.0, 0.08469886729381472, 0.016592375760878155, 0.0570283649448328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 137.55555555555557, 100, 307, 103.5, 306.1, 307.0, 307.0, 0.0949251936737632, 0.04916210388507723, 0.05280831900666059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 104.72222222222221, 102, 112, 104.0, 111.1, 112.0, 112.0, 0.09492269074187357, 0.0705431324751619, 0.04764674125129201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f63ee511-ff12-4ba5-bc56-6a6b030e0742", 3, 0, 0.0, 288.0, 214, 428, 222.0, 428.0, 428.0, 428.0, 0.021729053192722215, 0.025683005254809366, 0.013934321220593349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 268.27777777777777, 100, 825, 112.0, 823.2, 825.0, 825.0, 0.09492419248516809, 4.673131591957811, 0.054538150955833885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 307.1111111111112, 101, 1153, 104.0, 1122.4, 1153.0, 1153.0, 0.09492469307682572, 14.256888591040692, 0.054445738672319964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f84ca3e3-4758-44d4-b88b-b34df56a110e", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.6036596172022684, 1.1279389177693762], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 235.86666666666667, 104, 399, 216.0, 391.2, 399.0, 399.0, 0.08445993502215665, 0.14088752963136056, 0.05459103091796688], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/16c4b15a-67b0-4a2a-b564-ec2b99c42c70", 3, 0, 0.0, 313.6666666666667, 189, 483, 269.0, 483.0, 483.0, 483.0, 0.03200716960599174, 0.026370490323165723, 0.020525431029884026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a9b3138-647d-482a-8864-25348e44f9f6", 1, 0, 0.0, 1219.0, 1219, 1219, 1219.0, 1219.0, 1219.0, 1219.0, 0.8203445447087777, 0.2619654942575882, 0.4894829265791632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=259327ae-e6e3-4cdf-bdc7-0f8f55df98a1", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 103.875, 101, 107, 104.0, 106.3, 107.0, 107.0, 0.14537789165712625, 0.10803962456159479, 0.07297288702320594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 115.62499999999999, 100, 308, 103.0, 166.60000000000014, 308.0, 308.0, 0.1453792125898398, 0.05254734478497506, 0.08214848328593365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 672.6666666666666, 504, 809, 658.0, 809.0, 809.0, 809.0, 0.04576763770337994, 13.457205113389321, 0.02610185587770887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1088.6666666666665, 907, 1319, 1046.5, 1319.0, 1319.0, 1319.0, 0.04570035798613756, 41.1212624485871, 0.02601885615812324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 270.0, 102, 305, 304.0, 305.0, 305.0, 305.0, 0.04601297565913588, 0.08142139833433028, 0.025477887889384807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5893d336-7264-477d-8df8-aad52142416e", 3, 0, 0.0, 1093.3333333333333, 321, 1987, 972.0, 1987.0, 1987.0, 1987.0, 0.03540491420209125, 0.022761948420940828, 0.02270432323506503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 119.84615384615384, 102, 310, 103.0, 230.79999999999993, 310.0, 310.0, 0.06347222357846632, 0.047170275530481316, 0.03186008097590985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 182.00000000000003, 100, 315, 105.0, 313.0, 315.0, 315.0, 0.06347346320980421, 0.024317507690054196, 0.03578964955324447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 198.23076923076923, 102, 903, 104.0, 670.5999999999998, 903.0, 903.0, 0.06347284338808272, 4.409097771675976, 0.036895497456203734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 203.46153846153848, 101, 805, 104.0, 605.7999999999998, 805.0, 805.0, 0.06347284338808272, 1.4514168023602132, 0.03695748265482491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f87181f3-9946-492e-b4fd-3f2991ea58ce", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.255175229519774, 0.9738038488700566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0055782c-f2ff-49cd-b8f6-28286ec4bf26", 3, 0, 0.0, 430.3333333333333, 344, 561, 386.0, 561.0, 561.0, 561.0, 0.07490823740917377, 0.03477185759944069, 0.04803685797398187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 103.16666666666667, 102, 105, 103.0, 105.0, 105.0, 105.0, 0.0460133285274968, 0.034195452157641665, 0.025837562405576817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 697.2222222222223, 102, 1416, 878.0, 1397.1000000000001, 1416.0, 1416.0, 0.08482363752032232, 42.4126379120426, 0.045817281638038686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 184.68750000000003, 101, 1211, 103.5, 574.7000000000007, 1211.0, 1211.0, 0.1453805335465581, 8.212589286931198, 0.08468700025441593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9d3e743-7d01-4615-aee7-9a3a792d28a5", 1, 0, 0.0, 1131.0, 1131, 1131, 1131.0, 1131.0, 1131.0, 1131.0, 0.8841732979664013, 0.15973833996463307, 0.6095960433244916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 495.1111111111111, 102, 908, 603.5, 905.3, 908.0, 908.0, 0.08482323779723477, 13.866187955335853, 0.045899900921745854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 172.5, 102, 809, 103.0, 456.9000000000003, 809.0, 809.0, 0.1453818545272818, 2.7084291660987687, 0.08482974421879969], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 573.0000000000001, 104, 2018, 481.0, 1485.8000000000002, 2018.0, 2018.0, 0.084377742276624, 0.016529467871768334, 0.05737247007402741], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 365.84615384615387, 207, 1007, 218.0, 850.5999999999999, 1007.0, 1007.0, 0.06344001015040163, 5.928934073629452, 0.14142947575371612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66d87517-1a13-42a1-bc4a-8668aa912095", 3, 0, 0.0, 1170.6666666666667, 399, 2708, 405.0, 2708.0, 2708.0, 2708.0, 0.022142672620585304, 0.026171889415802486, 0.01419956545004982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6114ae8f-7467-4bf2-b783-1aa7c69ea139", 3, 0, 0.0, 350.33333333333337, 194, 645, 212.0, 645.0, 645.0, 645.0, 0.042961477874838894, 0.027620090756122012, 0.027550166475726764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 636.1739130434783, 159, 1690, 544.0, 1391.4, 1639.7999999999993, 1690.0, 0.10167858074384513, 0.06245686258581893, 0.04597381141054716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 115.3888888888889, 102, 302, 104.0, 127.40000000000028, 302.0, 302.0, 0.08482123923830527, 0.06303609673862334, 0.04257628610203995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 218.2777777777778, 101, 314, 306.0, 312.2, 314.0, 314.0, 0.08482403724717724, 0.09347579451848222, 0.0444184899907636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64a4a5bd-182c-4e49-b099-97b513ab92bd", 3, 0, 0.0, 280.3333333333333, 220, 393, 228.0, 393.0, 393.0, 393.0, 0.020281918669506138, 0.0279602622283068, 0.013006308521786162], "isController": false}, {"data": ["login", 23, 0, 0.0, 2740.608695652174, 1717, 4394, 2612.0, 3690.6000000000004, 4270.999999999998, 4394.0, 0.1020009934009792, 31.973084487866316, 0.19802103521029943], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 107.625, 104, 124, 106.5, 113.50000000000001, 124.0, 124.0, 0.13866860802717906, 0.11226198833450335, 0.0492923567596613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a7167da-8bad-440b-9be2-be23211a972b", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.79833984375, 1.49169921875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 825.6666666666666, 207, 1519, 984.0, 1501.0, 1519.0, 1519.0, 0.08477969055412947, 56.406165367496406, 0.17862057850363847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fcb5fbdb-131b-480b-9ae2-a0a313a285e9", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 458.7777777777779, 206, 1265, 408.5, 1229.9, 1265.0, 1265.0, 0.09487115969451486, 19.039008064377988, 0.20932184909160864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 758.4, 103, 1422, 1017.0, 1419.5, 1422.0, 1422.0, 0.07610813443740867, 54.63921890221627, 0.12314058314052606], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1171.4583333333333, 228, 2425, 1166.5, 2081.5, 2342.25, 2425.0, 0.09957638546018811, 0.03126348430219773, 0.044926064533795815], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 315.81249999999994, 207, 1313, 209.0, 683.7000000000006, 1313.0, 1313.0, 0.14524064559466968, 11.070920340612007, 0.32432704221964015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 110.4, 105, 147, 106.0, 130.8, 147.0, 147.0, 0.11247413094988153, 0.08732122471206623, 0.0399810387360907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0055782c-f2ff-49cd-b8f6-28286ec4bf26", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/259327ae-e6e3-4cdf-bdc7-0f8f55df98a1", 3, 0, 0.0, 398.33333333333337, 200, 794, 201.0, 794.0, 794.0, 794.0, 0.10866809142608759, 0.049169481472090416, 0.06968624352519288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 409.5555555555556, 208, 1244, 318.5, 1221.5, 1244.0, 1244.0, 0.10400355923291597, 13.968210662098214, 0.2309497438912354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 131.625, 102, 305, 105.0, 305.0, 305.0, 305.0, 0.050912284497845774, 0.03783618017857483, 0.02555558030458274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 129.99999999999997, 103, 304, 104.5, 304.0, 304.0, 304.0, 0.050912284497845774, 0.013623013625400138, 0.029035912252677668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 128.625, 101, 305, 103.5, 305.0, 305.0, 305.0, 0.050912284497845774, 0.013722451681059993, 0.02993085475361636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f63ee511-ff12-4ba5-bc56-6a6b030e0742", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 104.125, 102, 109, 103.5, 109.0, 109.0, 109.0, 0.050912932521272054, 0.01372262634362411, 0.029980955381178762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 106.0, 104, 108, 106.0, 108.0, 108.0, 108.0, 0.024541985201182923, 0.007237968291755121, 0.015170973273778117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9d3e743-7d01-4615-aee7-9a3a792d28a5", 2, 0, 0.0, 319.5, 235, 404, 319.5, 404.0, 404.0, 404.0, 0.028071357390486617, 0.03193665171866886, 0.01744865134672337], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1187.5964912280697, 809, 1828, 1113.0, 1635.4, 1734.1, 1828.0, 0.2729976579674606, 326.6001082711106, 0.5390637347755911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1171.4583333333333, 228, 2425, 1166.5, 2081.5, 2342.25, 2425.0, 0.09793080372626708, 0.030746829490229364, 0.04418362433743691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 153.75, 101, 307, 102.5, 307.0, 307.0, 307.0, 0.050107103934660335, 0.01350543035738892, 0.029506429367773618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 128.625, 102, 306, 102.0, 306.0, 306.0, 306.0, 0.05010679009639294, 0.01350534576816841, 0.029457312146512257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 157.66666666666669, 102, 315, 104.0, 309.0, 315.0, 315.0, 0.11582653817642698, 0.031218871617865088, 0.06809333592012602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 130.60000000000002, 102, 309, 103.0, 306.0, 309.0, 309.0, 0.11582743256912967, 0.031219112684648234, 0.0682069744523293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 102.75, 101, 107, 102.5, 107.0, 107.0, 107.0, 0.050107103934660335, 0.013407564920016537, 0.028576707712735974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 133.93333333333334, 102, 351, 104.0, 324.6, 351.0, 351.0, 0.11582564379753678, 0.08607745598625537, 0.05813904385931045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 128.5, 102, 306, 103.5, 306.0, 306.0, 306.0, 0.05010679009639294, 0.037237565686870144, 0.025151259872603488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 156.33333333333334, 102, 305, 103.0, 304.4, 305.0, 305.0, 0.11582743256912967, 0.030992887230411655, 0.06605783263708177], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 730.3571428571429, 103, 2131, 603.0, 2059.0, 2131.0, 2131.0, 0.0913152659557121, 0.017631184163323876, 0.062142280598767245], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 132.75, 104, 310, 108.5, 310.0, 310.0, 310.0, 0.050637398250477896, 0.03985717088855975, 0.018000012659349564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1395.6956521739135, 803, 2545, 1296.0, 1930.8000000000004, 2440.7999999999984, 2545.0, 0.10280064719711801, 0.05320736622507084, 0.047284282060393146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 283.875, 206, 614, 207.0, 614.0, 614.0, 614.0, 0.05007448579762397, 0.0776056728133098, 0.11261869217961717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f87181f3-9946-492e-b4fd-3f2991ea58ce", 3, 0, 0.0, 370.33333333333337, 199, 648, 264.0, 648.0, 648.0, 648.0, 0.0687096330905593, 0.04417367361779122, 0.04406184153268288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5893d336-7264-477d-8df8-aad52142416e", 1, 0, 0.0, 897.0, 897, 897, 897.0, 897.0, 897.0, 897.0, 1.1148272017837235, 0.20140921125975472, 0.7686210981047937], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 1111.2807017543862, 528, 2263, 861.0, 1875.4, 1994.199999999999, 2263.0, 0.2704356861238026, 97.54991143379546, 0.9801208642911027], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a181102a-3271-4012-b82a-b2e3c7a36acb", 3, 0, 0.0, 880.0, 210, 2131, 299.0, 2131.0, 2131.0, 2131.0, 0.05991492081244633, 0.027109941383235806, 0.03842200325537737], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 200.3859649122807, 102, 431, 105.0, 413.6, 417.2, 431.0, 0.27471335829851223, 0.2041570953761404, 0.13279600816187845], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 654.1754385964912, 499, 935, 608.0, 814.6, 923.5, 935.0, 0.2743695517186605, 80.6737581318081, 0.137988592905381], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 158.5087719298245, 101, 316, 106.0, 308.0, 309.4, 316.0, 0.27490414526513784, 0.4864514758012009, 0.1336936175215221], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 985.684210526316, 705, 1377, 1000.0, 1219.4, 1314.6, 1377.0, 0.2735886187134615, 246.1755200358665, 0.1373286621276555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 109.72222222222223, 103, 126, 106.0, 123.30000000000001, 126.0, 126.0, 0.10240247586430534, 0.0765018496447203, 0.036400880092389794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 8, 4.678362573099415, 176.90643274853807, 102, 1199, 109.0, 336.60000000000025, 457.0, 980.8400000000004, 0.7551836067745711, 1.6821880451343652, 0.36096175502903705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 111.5, 104, 140, 106.5, 140.0, 140.0, 140.0, 0.052861456729593824, 0.04093665545563272, 0.018790595946847805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd000354-784e-4a55-8b06-8c808518a340", 3, 0, 0.0, 429.6666666666667, 318, 649, 322.0, 649.0, 649.0, 649.0, 0.023803478481655455, 0.023873215235019677, 0.015264600458613687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66d87517-1a13-42a1-bc4a-8668aa912095", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 119.88888888888887, 103, 310, 108.0, 139.90000000000026, 310.0, 310.0, 0.0968319803753853, 0.07858142157416523, 0.03442074302406275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a181102a-3271-4012-b82a-b2e3c7a36acb", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 262.75, 206, 611, 211.5, 611.0, 611.0, 611.0, 0.0508782864193134, 0.0788514067846195, 0.11442645861687378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16c4b15a-67b0-4a2a-b564-ec2b99c42c70", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 319.3333333333333, 205, 656, 210.0, 629.6, 656.0, 656.0, 0.11573270374742495, 0.179363086764808, 0.2602855632132028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64a4a5bd-182c-4e49-b099-97b513ab92bd", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 110.3846153846154, 104, 136, 107.0, 128.4, 136.0, 136.0, 0.06473781186195907, 0.053674220967581295, 0.023012269060305762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 110.99999999999999, 103, 129, 107.5, 129.0, 129.0, 129.0, 0.08391021606880637, 0.06514513845185652, 0.02982745961820852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3b97bad-c493-43fe-b332-9dd1a8adc09d", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6114ae8f-7467-4bf2-b783-1aa7c69ea139", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 115.66666666666666, 102, 312, 104.0, 127.50000000000028, 312.0, 312.0, 0.10406609353229229, 0.0773381808379633, 0.0522363008550764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 163.5555555555556, 102, 332, 103.5, 313.1, 332.0, 332.0, 0.10406729685196427, 0.04521326568959038, 0.058379766137657906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 267.8888888888889, 101, 1139, 104.5, 929.3000000000003, 1139.0, 1139.0, 0.10406729685196427, 10.429370194114416, 0.060186490041337845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 222.77777777777774, 102, 810, 104.5, 624.6000000000003, 810.0, 810.0, 0.10406850019946462, 3.424888017957598, 0.06028881538248065], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 30.434782608695652, 0.5319148936170213], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.1519756838905775], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.1519756838905775], "isController": false}, {"data": ["401/Unauthorized", 12, 52.17391304347826, 0.9118541033434651], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 23, "401/Unauthorized", 12, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
