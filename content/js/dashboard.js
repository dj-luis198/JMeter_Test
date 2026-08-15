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

    var data = {"OkPercent": 96.75716440422323, "KoPercent": 3.2428355957767723};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7661917098445595, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34dcbfb2-49f1-44ea-a677-9e006803366b"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54a4a20d-d296-459b-94df-079499a58136"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f238a0d9-d0e0-46c4-b4db-938df168d5c7"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16e8fe6c-10b9-4666-93b7-365d6ccb0137"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71253e08-cb70-4af0-95f3-e4dab8c9ea92"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4751316f-c38f-44a7-a849-e5c10c109cda"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4fa935cc-cfa8-4fce-8a71-77c759677c69"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e89d6d2-95b4-4147-9681-f9d64cca641c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a5b6fab-542f-4365-b0e9-bc42f2dee1dc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd76ee9b-f012-46dd-b8f5-099cec19051d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/935decb3-b7d2-424d-9687-25b86e9e9dc6"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f336b3f1-c50b-4730-99ae-ee7ecf1b8124"], "isController": false}, {"data": [0.28125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41050404-4c11-424d-84cc-8db84c1ae134"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83fee7e9-b0e5-4f70-949c-4a9f8ffc456a"], "isController": false}, {"data": [0.125, 500, 1500, "register"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/34dcbfb2-49f1-44ea-a677-9e006803366b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=935decb3-b7d2-424d-9687-25b86e9e9dc6"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/16e8fe6c-10b9-4666-93b7-365d6ccb0137"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f238a0d9-d0e0-46c4-b4db-938df168d5c7"], "isController": false}, {"data": [0.20175438596491227, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4751316f-c38f-44a7-a849-e5c10c109cda"], "isController": false}, {"data": [0.8450292397660819, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9a5b6fab-542f-4365-b0e9-bc42f2dee1dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd76ee9b-f012-46dd-b8f5-099cec19051d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4fa935cc-cfa8-4fce-8a71-77c759677c69"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5e89d6d2-95b4-4147-9681-f9d64cca641c"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54a4a20d-d296-459b-94df-079499a58136"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41050404-4c11-424d-84cc-8db84c1ae134"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1326, 43, 3.2428355957767723, 337.7699849170439, 83, 4623, 97.0, 920.3, 1168.5999999999995, 1995.3100000000009, 5.177806499982428, 741.4548293063945, 3.794687745272225], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34dcbfb2-49f1-44ea-a677-9e006803366b", 1, 0, 0.0, 827.0, 827, 827, 827.0, 827.0, 827.0, 827.0, 1.2091898428053203, 0.2184571493349456, 0.833679715840387], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1524.6315789473686, 1018, 5803, 1383.0, 1775.6000000000004, 2048.1999999999916, 5803.0, 0.2491563652894585, 299.81985851360747, 1.2250999015941637], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54a4a20d-d296-459b-94df-079499a58136", 1, 0, 0.0, 1043.0, 1043, 1043, 1043.0, 1043.0, 1043.0, 1043.0, 0.9587727708533077, 0.17321578379674019, 0.661028883029722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f238a0d9-d0e0-46c4-b4db-938df168d5c7", 3, 0, 0.0, 314.3333333333333, 205, 457, 281.0, 457.0, 457.0, 457.0, 0.03139520281301018, 0.02617288880342417, 0.020132991387249364], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 503.71428571428567, 86, 1585, 457.5, 1268.5, 1585.0, 1585.0, 0.07417886644095098, 0.015217637151425559, 0.04965782514186708], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 503.71428571428567, 86, 1585, 457.5, 1268.5, 1585.0, 1585.0, 0.07302315877321093, 0.014980546174108074, 0.048884155604527434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 137.99999999999997, 83, 256, 86.0, 255.3, 256.0, 256.0, 0.08166056764302083, 0.021850581576355183, 0.046572042483910316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 128.06249999999997, 84, 256, 86.0, 254.6, 256.0, 256.0, 0.08166056764302083, 0.06068719919564341, 0.04098977711768819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 159.43749999999997, 84, 262, 87.0, 257.8, 262.0, 262.0, 0.08158769657535644, 0.02199043384257654, 0.048044317416933525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 137.75000000000003, 83, 254, 85.5, 254.0, 254.0, 254.0, 0.08166098442316723, 0.022010187207806793, 0.04800772717065104], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 206.66666666666666, 85, 453, 193.0, 382.80000000000007, 453.0, 453.0, 0.06849221243544609, 0.10633683528307832, 0.04426130863504153], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 99.73333333333332, 85, 257, 87.0, 162.20000000000005, 257.0, 257.0, 0.07778388525321248, 0.05780618816181122, 0.039043864277491416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 622.7777777777778, 423, 758, 676.0, 758.0, 758.0, 758.0, 0.04082743603701688, 12.004621793345128, 0.02328439711486119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 109.6, 85, 262, 86.0, 259.0, 262.0, 262.0, 0.07778791901759044, 0.028603266055426485, 0.043927891247303355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 941.6666666666666, 829, 1166, 916.0, 1166.0, 1166.0, 1166.0, 0.04075367122654966, 36.670225006962085, 0.023202529614334423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 123.77777777777777, 85, 255, 87.0, 255.0, 255.0, 255.0, 0.04090555815634104, 0.07238366345633786, 0.02264985495570837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 100.3529411764706, 85, 255, 87.0, 138.1999999999999, 255.0, 255.0, 0.09969446578427289, 0.0740893442010075, 0.050041948645621365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 106.0, 84, 252, 86.0, 252.0, 252.0, 252.0, 0.09969738910131601, 0.026676840443125575, 0.05685866722184429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 96.05882352941177, 84, 256, 86.0, 123.99999999999989, 256.0, 256.0, 0.0996968044241923, 0.026871404317458086, 0.05861081666344118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 120.88235294117646, 85, 343, 86.0, 270.99999999999994, 343.0, 343.0, 0.0996968044241923, 0.026871404317458086, 0.058708176824011686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 86.55555555555556, 85, 90, 86.0, 90.0, 90.0, 90.0, 0.0409051863231237, 0.03039926444521205, 0.022969220835738408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16e8fe6c-10b9-4666-93b7-365d6ccb0137", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 668.0714285714287, 84, 1163, 913.5, 1136.0, 1163.0, 1163.0, 0.0902416542584392, 52.208429064016784, 0.048066773989776906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 181.06666666666663, 83, 841, 87.0, 490.6000000000002, 841.0, 841.0, 0.07778832241703876, 4.685839908067168, 0.04528536321960681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 424.7857142857143, 85, 759, 503.5, 753.5, 759.0, 759.0, 0.09024107257960551, 17.066175611544413, 0.04815459020884363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 158.8, 84, 674, 86.0, 421.40000000000015, 674.0, 674.0, 0.07778832241703876, 1.5443919319248463, 0.0453613283782172], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 507.7857142857143, 88, 1043, 469.5, 1001.5, 1043.0, 1043.0, 0.07295504405963553, 0.014966572585057765, 0.04918460524807321], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 222.94117647058823, 171, 599, 176.0, 393.3999999999998, 599.0, 599.0, 0.09964421155052255, 0.15442906614324148, 0.22410216718833342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71253e08-cb70-4af0-95f3-e4dab8c9ea92", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4751316f-c38f-44a7-a849-e5c10c109cda", 1, 0, 0.0, 960.0, 960, 960, 960.0, 960.0, 960.0, 960.0, 1.0416666666666667, 0.18819173177083334, 0.7181803385416667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fa935cc-cfa8-4fce-8a71-77c759677c69", 3, 0, 0.0, 439.0, 190, 933, 194.0, 933.0, 933.0, 933.0, 0.024414658561000023, 0.024486185881002955, 0.015656535600641293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 679.2173913043476, 240, 1888, 517.0, 1488.8000000000004, 1835.9999999999993, 1888.0, 0.09306804892951512, 0.05716777614908692, 0.04208057290465381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 89.21428571428571, 84, 105, 88.0, 100.0, 105.0, 105.0, 0.09023874593925643, 0.06706219302712318, 0.045295620520290826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 170.78571428571428, 84, 259, 169.5, 258.5, 259.0, 259.0, 0.0902428176386033, 0.11128017091345069, 0.046594401238904966], "isController": false}, {"data": ["login", 23, 0, 0.0, 2965.869565217391, 1699, 4128, 3056.0, 3842.4, 4087.1999999999994, 4128.0, 0.09497264374935481, 44.586071377877566, 0.2049178344688758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e89d6d2-95b4-4147-9681-f9d64cca641c", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 93.66666666666667, 87, 140, 89.0, 123.20000000000002, 140.0, 140.0, 0.0759778347330139, 0.06150939940787941, 0.027007745940251033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a5b6fab-542f-4365-b0e9-bc42f2dee1dc", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd76ee9b-f012-46dd-b8f5-099cec19051d", 3, 0, 0.0, 321.66666666666663, 187, 590, 188.0, 590.0, 590.0, 590.0, 0.04414426345296429, 0.027460835761267822, 0.028308658529407435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/935decb3-b7d2-424d-9687-25b86e9e9dc6", 3, 0, 0.0, 508.6666666666667, 453, 559, 514.0, 559.0, 559.0, 559.0, 0.026920799009314596, 0.026999668537662197, 0.017263663427197186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 758.7857142857142, 171, 1251, 1004.0, 1225.5, 1251.0, 1251.0, 0.09018817117714889, 69.41189536682428, 0.18800106776352662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f336b3f1-c50b-4730-99ae-ee7ecf1b8124", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.5641977694346291, 1.0542043948763251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, 43.75, 627.0, 85, 1255, 918.0, 1135.3000000000002, 1255.0, 1255.0, 0.0711070027065103, 47.859465689204626, 0.11072710937812481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 320.31249999999994, 171, 511, 340.0, 510.3, 511.0, 511.0, 0.08155110195926522, 0.1263882800872597, 0.18341033966033965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41050404-4c11-424d-84cc-8db84c1ae134", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83fee7e9-b0e5-4f70-949c-4a9f8ffc456a", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.8919998254189945, 1.6667030377094973], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1164.0416666666667, 255, 2169, 1272.5, 2015.0, 2132.25, 2169.0, 0.09805603902630354, 0.03035523864388498, 0.044240126982570536], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 305.26666666666665, 172, 1098, 191.0, 652.8000000000002, 1098.0, 1098.0, 0.07774921214131697, 6.313468868567549, 0.17353360936463344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 110.57894736842105, 86, 260, 93.0, 260.0, 260.0, 260.0, 0.106575124244158, 0.08274142946690001, 0.03788412619616554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 334.3125, 170, 1161, 177.5, 1102.9, 1161.0, 1161.0, 0.10178376040102802, 15.359122230368458, 0.22565877153362682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 87.375, 85, 93, 87.0, 93.0, 93.0, 93.0, 0.036947405368458, 0.027457983872457556, 0.01854586558533927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 106.25, 84, 253, 85.0, 253.0, 253.0, 253.0, 0.03694774664930123, 0.009886408771395055, 0.021071761760929605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 107.0, 84, 256, 85.5, 256.0, 256.0, 256.0, 0.036947405368458, 0.009958480353217196, 0.02172103323419113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 128.0, 84, 256, 86.0, 256.0, 256.0, 256.0, 0.03694774664930123, 0.009958572339069471, 0.021757315653836564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 90.66666666666667, 88, 96, 88.0, 96.0, 96.0, 96.0, 0.04605323754259925, 0.013582107165883763, 0.028468456410610667], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 964.1754385964914, 670, 1535, 898.0, 1324.8, 1480.8999999999999, 1535.0, 0.2483649308717609, 297.1308029431244, 0.490423720920606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1164.0416666666667, 255, 2169, 1272.5, 2015.0, 2132.25, 2169.0, 0.0988195185018961, 0.030591589223731508, 0.04458458744909766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 131.77777777777777, 83, 336, 86.0, 336.0, 336.0, 336.0, 0.05321602157022741, 0.014343380813850354, 0.031337168951999145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 104.33333333333333, 84, 255, 85.0, 255.0, 255.0, 255.0, 0.053162582992699006, 0.014328977447250904, 0.03125378414219219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34dcbfb2-49f1-44ea-a677-9e006803366b", 3, 0, 0.0, 1109.3333333333335, 294, 2730, 304.0, 2730.0, 2730.0, 2730.0, 0.04253690076141052, 0.027845607887759298, 0.02727789534504516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=935decb3-b7d2-424d-9687-25b86e9e9dc6", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 134.78947368421055, 83, 832, 86.0, 253.0, 832.0, 832.0, 0.10388644664610808, 4.946379941782582, 0.06060398691577543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 125.31578947368422, 84, 669, 86.0, 253.0, 669.0, 669.0, 0.10388587862848771, 1.6342056045064601, 0.060705106606048345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 123.0, 83, 256, 86.0, 256.0, 256.0, 256.0, 0.053216650898770104, 0.014239611666272469, 0.030350121215704823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 87.8421052631579, 85, 97, 86.0, 97.0, 97.0, 97.0, 0.10388133471112787, 0.07720087472184406, 0.05214356058742161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 89.0, 85, 97, 86.0, 97.0, 97.0, 97.0, 0.05321602157022741, 0.03954823478021783, 0.02671194832724305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 94.89473684210526, 83, 255, 86.0, 89.0, 255.0, 255.0, 0.10388587862848771, 0.03600978440946346, 0.058788215650681], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 943.6428571428572, 88, 2936, 554.0, 2833.0, 2936.0, 2936.0, 0.0717415255322965, 0.014297261331317737, 0.04881686534371877], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 133.22222222222223, 89, 275, 97.0, 275.0, 275.0, 275.0, 0.05019408379065721, 0.039508233921161824, 0.01784242822246018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1624.086956521739, 997, 3097, 1586.0, 2279.4, 2948.5999999999976, 3097.0, 0.09432917601414118, 0.048822718054194164, 0.04338773623306689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 241.22222222222223, 172, 423, 178.0, 423.0, 423.0, 423.0, 0.053135590218328234, 0.08234978679344425, 0.11950318776641596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16e8fe6c-10b9-4666-93b7-365d6ccb0137", 3, 0, 0.0, 1033.6666666666665, 305, 2460, 336.0, 2460.0, 2460.0, 2460.0, 0.07402837754472548, 0.03349591301665639, 0.047472624922887105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f238a0d9-d0e0-46c4-b4db-938df168d5c7", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["addBook", 57, 20, 35.08771929824562, 998.0526315789475, 432, 3511, 715.0, 1949.0000000000002, 2477.699999999999, 3511.0, 0.25834171810839474, 71.54762109626401, 0.9387814400737859], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 149.98245614035085, 84, 442, 87.0, 349.2, 352.59999999999997, 442.0, 0.24910083339524436, 0.18512278731814547, 0.12041495364320894], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 534.2631578947367, 413, 763, 501.0, 677.4, 751.8, 763.0, 0.24906600249066002, 73.233674501868, 0.12526268679950187], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 128.87719298245608, 83, 350, 89.0, 257.2, 263.1, 350.0, 0.24943003050047918, 0.44137423365905104, 0.12130483905199085], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 809.4736842105266, 577, 1163, 781.0, 1017.2000000000002, 1089.3, 1163.0, 0.24879313505538922, 223.86450025452194, 0.12488249161959966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 112.9375, 86, 271, 90.5, 260.5, 271.0, 271.0, 0.10779637265206025, 0.08053146980354112, 0.038318241841162046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4751316f-c38f-44a7-a849-e5c10c109cda", 3, 0, 0.0, 312.6666666666667, 188, 558, 192.0, 558.0, 558.0, 558.0, 0.030499893250373625, 0.025426506059312126, 0.01955885081485548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 20, 11.695906432748538, 217.88304093567257, 85, 4623, 92.0, 326.6, 731.8000000000034, 2968.4400000000023, 0.7042978644535514, 1.5880528390720567, 0.334688696997467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 91.25, 89, 101, 89.5, 101.0, 101.0, 101.0, 0.036403846066336905, 0.028191650322856608, 0.012940429656393198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 91.43749999999999, 86, 106, 89.5, 101.80000000000001, 106.0, 106.0, 0.07867588485784252, 0.06384732452819054, 0.027966818445561203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a5b6fab-542f-4365-b0e9-bc42f2dee1dc", 3, 0, 0.0, 890.3333333333334, 193, 1870, 608.0, 1870.0, 1870.0, 1870.0, 0.07729966503478485, 0.034976085416129864, 0.049570423215666064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 216.875, 173, 344, 175.5, 344.0, 344.0, 344.0, 0.036932224751053726, 0.05723773503898658, 0.08306143906413742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 224.0526315789474, 171, 920, 176.0, 338.0, 920.0, 920.0, 0.10383251269215846, 6.6903339615655755, 0.23212351662959665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd76ee9b-f012-46dd-b8f5-099cec19051d", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4fa935cc-cfa8-4fce-8a71-77c759677c69", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 0.19616076275787186, 0.7485918838219326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e89d6d2-95b4-4147-9681-f9d64cca641c", 3, 0, 0.0, 1164.6666666666665, 221, 2936, 337.0, 2936.0, 2936.0, 2936.0, 0.015731185502139443, 0.021686709180195485, 0.010088032369536034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 233.41176470588235, 86, 2343, 89.0, 674.1999999999985, 2343.0, 2343.0, 0.09988073065692143, 0.08281126985129522, 0.035504478475702546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54a4a20d-d296-459b-94df-079499a58136", 3, 0, 0.0, 391.0, 212, 550, 411.0, 550.0, 550.0, 550.0, 0.024823340559683587, 0.024896065190229532, 0.015918613575057507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 91.07142857142858, 86, 106, 89.5, 101.5, 106.0, 106.0, 0.08689769038352915, 0.06746451548330633, 0.03088941337852013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41050404-4c11-424d-84cc-8db84c1ae134", 3, 0, 0.0, 304.0, 188, 447, 277.0, 447.0, 447.0, 447.0, 0.02335502755893252, 0.02342345049123408, 0.01497701962600816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 87.0, 85, 92, 87.0, 90.6, 92.0, 92.0, 0.10183882732590334, 0.07568295663575435, 0.05111831762257258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 117.25, 83, 256, 85.5, 254.6, 256.0, 256.0, 0.10184206841240945, 0.046370961325474525, 0.05701266183341184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 235.81249999999997, 85, 1073, 86.0, 1016.3000000000001, 1073.0, 1073.0, 0.10184077195305141, 11.478581314286988, 0.05877724240649744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 168.875, 84, 502, 86.0, 499.9, 502.0, 502.0, 0.1018414201786044, 3.7671131378614575, 0.058877071040755666], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 23.25581395348837, 0.7541478129713424], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.30232558139535, 0.30165912518853694], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.976744186046512, 0.22624434389140272], "isController": false}, {"data": ["401/Unauthorized", 26, 60.46511627906977, 1.9607843137254901], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1326, 43, "401/Unauthorized", 26, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
