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

    var data = {"OkPercent": 96.79943100995733, "KoPercent": 3.200568990042674};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7869750456482045, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4745762711864407, 500, 1500, "see books"], "isController": true}, {"data": [0.38235294117647056, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.38235294117647056, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60d89c30-f48b-443b-a341-081bfc12c7f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81eaa2bc-d8ce-4a19-9cf8-9813e3c2b61e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01b02809-7f0e-4360-b53d-95c39b1101b3"], "isController": false}, {"data": [0.76, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c44878ac-b3d2-4c26-acb0-cf906b8b8e58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60d89c30-f48b-443b-a341-081bfc12c7f9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a3cac93-e26f-4fe2-8e42-3c3d5ea3734c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2965266e-dd5f-4518-abea-1e70f2dffff3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83040f33-0b60-489d-8b2a-ebc52bb946c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/daf70fe8-e3cf-4358-b1f3-2b87d00406ce"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c617c8f-c0e3-4a66-9408-90f2c29469ac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81eaa2bc-d8ce-4a19-9cf8-9813e3c2b61e"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59593b30-0390-434d-9a69-2cbbfc89ddd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33ee2823-26ee-4348-a4b7-a0672d1dd38b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.40625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/cb414ff3-8e31-47ac-a313-0d4bb29225d6"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59f4e6a5-6d4c-4fac-88ff-fdc1a32ba191"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e4ffcf0-9d26-45e1-9486-b126f4f57142"], "isController": false}, {"data": [0.3225806451612903, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/135d3b0a-d26c-408d-b5c6-0dd82a0aaf21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.847457627118644, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8852459016393442, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=135d3b0a-d26c-408d-b5c6-0dd82a0aaf21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2965266e-dd5f-4518-abea-1e70f2dffff3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/59593b30-0390-434d-9a69-2cbbfc89ddd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/018b9e25-a006-408a-adc0-be224844cce8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e4ffcf0-9d26-45e1-9486-b126f4f57142"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a3cac93-e26f-4fe2-8e42-3c3d5ea3734c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5c617c8f-c0e3-4a66-9408-90f2c29469ac"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daf70fe8-e3cf-4358-b1f3-2b87d00406ce"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83040f33-0b60-489d-8b2a-ebc52bb946c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c44878ac-b3d2-4c26-acb0-cf906b8b8e58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1406, 45, 3.200568990042674, 299.79231863442357, 79, 4846, 90.0, 680.0, 869.7999999999984, 2486.1500000000033, 5.54412031450856, 786.6758170159344, 4.05458543924141], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1189.8644067796608, 971, 1760, 1144.0, 1391.0, 1522.0, 1760.0, 0.25535598355334344, 307.2790825849383, 1.255583376163168], "isController": true}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 552.9411764705883, 83, 1655, 535.0, 1438.1999999999998, 1655.0, 1655.0, 0.09070052819719363, 0.019434338819826067, 0.060371497025556206], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 552.9411764705883, 83, 1655, 535.0, 1438.1999999999998, 1655.0, 1655.0, 0.09008388399315362, 0.019302210896970533, 0.059961050311849215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 127.07142857142858, 80, 240, 82.5, 240.0, 240.0, 240.0, 0.08833699300875798, 0.023637046957421567, 0.050379691325307285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 93.42857142857143, 81, 238, 82.0, 161.0, 238.0, 238.0, 0.08833587824792095, 0.06564805014323032, 0.04434047013616345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 104.49999999999999, 80, 239, 81.5, 239.0, 239.0, 239.0, 0.08833587824792095, 0.023809279684009945, 0.05201810017919564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 115.85714285714286, 80, 251, 81.0, 246.0, 251.0, 251.0, 0.08833643562482255, 0.02380942991450295, 0.051932162349749185], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 243.35294117647058, 81, 1141, 194.0, 500.1999999999994, 1141.0, 1141.0, 0.0905107468201445, 0.14464145598515624, 0.058487786706100955], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60d89c30-f48b-443b-a341-081bfc12c7f9", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 83.85000000000001, 80, 122, 82.0, 83.9, 120.09999999999997, 122.0, 0.11566108987444988, 0.08595516542427378, 0.05805644550338598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 115.45000000000002, 80, 248, 82.5, 240.0, 247.6, 248.0, 0.11555550419755369, 0.03959807267863436, 0.06541750564777526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 487.1111111111111, 396, 634, 401.0, 634.0, 634.0, 634.0, 0.06121116491648076, 17.99811488740546, 0.03490949249143043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 615.1111111111111, 551, 810, 557.0, 810.0, 810.0, 810.0, 0.06120991600639304, 55.076790018107936, 0.034849004913796035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 178.66666666666663, 80, 288, 238.0, 288.0, 288.0, 288.0, 0.06134300280814635, 0.10854836043785272, 0.033966291593963846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81eaa2bc-d8ce-4a19-9cf8-9813e3c2b61e", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 0.6082965067340068, 2.3213909932659935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 92.66666666666666, 81, 241, 82.0, 146.80000000000007, 241.0, 241.0, 0.06801148033788104, 0.05054368802453855, 0.03413857509147544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 116.66666666666667, 80, 242, 82.0, 240.8, 242.0, 242.0, 0.06796402437643008, 0.024990938130083143, 0.038380204911533496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 145.9333333333333, 80, 551, 81.0, 364.4000000000001, 551.0, 551.0, 0.06796371643725137, 4.094021890263519, 0.03956585627486339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 147.86666666666667, 80, 552, 82.0, 365.4000000000001, 552.0, 552.0, 0.0680133306128001, 1.350321433834365, 0.03966115900383142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 81.77777777777777, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.061408296943231445, 0.04563643942753821, 0.03448219799058406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 451.235294117647, 79, 780, 712.0, 746.4, 780.0, 780.0, 0.08971023593792052, 47.493149287727114, 0.04820482232096212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 126.9, 80, 555, 82.0, 317.50000000000017, 543.5499999999998, 555.0, 0.11566309653242036, 5.233308956733327, 0.0675002602419672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 359.88235294117646, 81, 641, 415.0, 585.0, 641.0, 641.0, 0.08971023593792052, 15.526302249616093, 0.04829242997324524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 115.10000000000001, 79, 557, 82.0, 226.70000000000027, 541.1499999999997, 557.0, 0.11565841443879646, 1.729985582455775, 0.06761047547174176], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 368.8125, 83, 1038, 375.0, 834.3000000000002, 1038.0, 1038.0, 0.08634786316022386, 0.018683055108825293, 0.057609160901147885], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 252.73333333333335, 162, 634, 169.0, 542.2, 634.0, 634.0, 0.06793755180238324, 5.5167326651675115, 0.15163431565371777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01b02809-7f0e-4360-b53d-95c39b1101b3", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 492.3600000000001, 84, 1375, 402.0, 1149.8000000000002, 1328.5, 1375.0, 0.10627850921009561, 0.06528240458315443, 0.04805366187917409], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c44878ac-b3d2-4c26-acb0-cf906b8b8e58", 3, 0, 0.0, 525.0, 190, 1130, 255.0, 1130.0, 1130.0, 1130.0, 0.03389217768539021, 0.03399147117470288, 0.02173424154955036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 82.11764705882354, 80, 85, 82.0, 84.2, 85.0, 85.0, 0.08970928913303887, 0.06666871975609627, 0.045029858021857404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 115.11764705882354, 80, 328, 81.0, 261.59999999999997, 328.0, 328.0, 0.08971023593792052, 0.10326365508525111, 0.0467309524060813], "isController": false}, {"data": ["login", 25, 0, 0.0, 3177.9600000000005, 1362, 9028, 2407.0, 6324.400000000001, 8257.599999999999, 9028.0, 0.10518211230925224, 45.44091996351233, 0.2214864112599555], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/60d89c30-f48b-443b-a341-081bfc12c7f9", 3, 0, 0.0, 428.6666666666667, 320, 523, 443.0, 523.0, 523.0, 523.0, 0.022371031006248973, 0.026441801296774096, 0.014346006211689608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a3cac93-e26f-4fe2-8e42-3c3d5ea3734c", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 92.44999999999999, 82, 243, 84.0, 90.7, 235.3999999999999, 243.0, 0.11059377799405005, 0.08953343941119872, 0.03931263202132248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2965266e-dd5f-4518-abea-1e70f2dffff3", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 544.529411764706, 164, 862, 795.0, 829.1999999999999, 862.0, 862.0, 0.08967048733272498, 63.1613868084823, 0.18817512481340626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83040f33-0b60-489d-8b2a-ebc52bb946c3", 1, 0, 0.0, 747.0, 747, 747, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 0.241852827978581, 0.9229626840696118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 244.64285714285717, 163, 478, 166.0, 407.0, 478.0, 478.0, 0.08828964047197119, 0.13683169866115066, 0.1985654707099118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, 52.63157894736842, 385.7368421052632, 80, 893, 243.0, 802.0, 893.0, 893.0, 0.12239271312436387, 69.37608502750615, 0.17341064607248224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daf70fe8-e3cf-4358-b1f3-2b87d00406ce", 3, 0, 0.0, 1370.3333333333333, 194, 3276, 641.0, 3276.0, 3276.0, 3276.0, 0.05342165713980448, 0.03434497814163862, 0.03425802882988764], "isController": false}, {"data": ["register", 25, 9, 36.0, 1051.4000000000005, 103, 3052, 914.0, 2725.6000000000004, 2967.3999999999996, 3052.0, 0.10614314039340894, 0.03307022217882147, 0.04788879966968255], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c617c8f-c0e3-4a66-9408-90f2c29469ac", 1, 0, 0.0, 1038.0, 1038, 1038, 1038.0, 1038.0, 1038.0, 1038.0, 0.9633911368015414, 0.17405015655105974, 0.6642130298651252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81eaa2bc-d8ce-4a19-9cf8-9813e3c2b61e", 3, 0, 0.0, 319.3333333333333, 194, 514, 250.0, 514.0, 514.0, 514.0, 0.07069302731107288, 0.03198675389400759, 0.045333744727478385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 244.79999999999998, 164, 640, 167.0, 407.0000000000001, 628.5499999999998, 640.0, 0.11550078251780156, 7.07900799445885, 0.2582863690307752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 93.0625, 82, 243, 83.0, 132.40000000000012, 243.0, 243.0, 0.08738203425375742, 0.0678405441716183, 0.031061582488640334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 291.7058823529412, 163, 801, 322.0, 448.99999999999966, 801.0, 801.0, 0.10923484205926955, 7.846560588390265, 0.24402767537011336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 87.21428571428571, 81, 149, 82.5, 116.5, 149.0, 149.0, 0.06989725104096978, 0.05194512504118945, 0.03508514358892428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 121.35714285714283, 80, 321, 81.5, 281.0, 321.0, 321.0, 0.06989620413685678, 0.01870269524755738, 0.03986267892180113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 103.92857142857142, 80, 240, 81.0, 239.5, 240.0, 240.0, 0.06984285357944625, 0.018824831628835123, 0.04105995884260414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 133.0, 81, 321, 82.5, 281.0, 321.0, 321.0, 0.06989794899446808, 0.018839681564915223, 0.04116060863639087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 84.2, 83, 86, 84.0, 86.0, 86.0, 86.0, 0.04706724025943463, 0.013881158748387948, 0.029095276449435666], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 771.1016949152541, 633, 1429, 662.0, 1050.0, 1132.0, 1429.0, 0.261064257205816, 312.32361223882515, 0.5154999297560156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1051.4000000000005, 103, 3052, 914.0, 2725.6000000000004, 2967.3999999999996, 3052.0, 0.1052675902143248, 0.03279743357615057, 0.04749377605372858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 101.125, 79, 240, 82.0, 240.0, 240.0, 240.0, 0.03821881225486215, 0.010301164240568313, 0.022505804482111206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 100.875, 81, 237, 81.5, 237.0, 237.0, 237.0, 0.038247865291018444, 0.010308994941719815, 0.02248556143085264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 187.9375, 79, 554, 83.5, 553.3, 554.0, 554.0, 0.08716780892816284, 9.82477610471578, 0.050308764723187724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 198.75000000000003, 80, 558, 106.5, 554.5, 558.0, 558.0, 0.08716828381993212, 3.2243539672465173, 0.05039416408339826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59593b30-0390-434d-9a69-2cbbfc89ddd4", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33ee2823-26ee-4348-a4b7-a0672d1dd38b", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 1.7642869475138123, 3.296572859116022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 121.0, 80, 241, 82.0, 241.0, 241.0, 241.0, 0.03824804815429262, 0.010234341010035331, 0.021813339962995015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 101.6875, 81, 244, 81.5, 239.8, 244.0, 244.0, 0.08739205715440537, 0.0649466362251001, 0.04386671618883239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 81.875, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.038247499569715626, 0.028424167160696873, 0.019198451932454917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 123.06249999999999, 80, 242, 81.5, 239.9, 242.0, 242.0, 0.0873176561758141, 0.03975767303903645, 0.048881685940220146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 86.12500000000001, 84, 93, 84.5, 93.0, 93.0, 93.0, 0.03940634343613463, 0.03101710235305128, 0.014007723643313482], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 471.37499999999994, 80, 1130, 507.5, 1028.5, 1130.0, 1130.0, 0.08699008856678392, 0.018078689671014357, 0.059184479812862574], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cb414ff3-8e31-47ac-a313-0d4bb29225d6", 2, 0, 0.0, 707.5, 274, 1141, 707.5, 1141.0, 1141.0, 1141.0, 0.015974185715883132, 0.027299633791792465, 0.009929266804843373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1879.04, 902, 4631, 1238.0, 4331.200000000001, 4597.4, 4631.0, 0.10249262053132174, 0.05304793836093802, 0.0471426018264185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 224.0, 162, 323, 166.5, 323.0, 323.0, 323.0, 0.03820348129223275, 0.05920793438552088, 0.08592052482032425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59f4e6a5-6d4c-4fac-88ff-fdc1a32ba191", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e4ffcf0-9d26-45e1-9486-b126f4f57142", 3, 0, 0.0, 362.0, 227, 602, 257.0, 602.0, 602.0, 602.0, 0.06368615462998345, 0.02881632647645735, 0.040840405150087036], "isController": false}, {"data": ["addBook", 62, 16, 25.806451612903224, 935.983870967742, 412, 5306, 710.0, 1523.800000000001, 2313.249999999997, 5306.0, 0.2993693928595571, 87.87299894798215, 1.087746202656179], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/135d3b0a-d26c-408d-b5c6-0dd82a0aaf21", 3, 0, 0.0, 471.3333333333333, 188, 985, 241.0, 985.0, 985.0, 985.0, 0.036414395824482616, 0.030143817897675545, 0.023351679614007404], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 138.62711864406776, 80, 333, 83.0, 328.0, 331.0, 333.0, 0.2618870068534498, 0.19462501192917508, 0.1265957699145094], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 464.2881355932204, 395, 669, 408.0, 583.0, 645.0, 669.0, 0.261854462177564, 76.9939062666433, 0.1316943828334428], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 121.6271186440678, 80, 336, 83.0, 258.0, 327.0, 336.0, 0.2620370493739979, 0.4636827475250823, 0.12743598690258884], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 629.084745762712, 552, 1102, 565.0, 758.0, 814.0, 1102.0, 0.26149236796851455, 235.29129235262246, 0.13125691126544578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 84.29411764705884, 83, 89, 83.0, 87.4, 89.0, 89.0, 0.10980138866462134, 0.08202935774261264, 0.03903096237687712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 16, 8.743169398907105, 188.5628415300546, 81, 4334, 85.0, 246.6, 400.3999999999995, 3827.4799999999977, 0.7526899411009839, 1.67011515667673, 0.36017791425709916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 84.57142857142857, 82, 96, 84.0, 91.0, 96.0, 96.0, 0.06842051246963839, 0.052985807019944584, 0.024321354041941776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 101.00000000000001, 82, 241, 84.0, 195.5, 241.0, 241.0, 0.0892902699117302, 0.0724611467740701, 0.03173990063268534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=135d3b0a-d26c-408d-b5c6-0dd82a0aaf21", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 243.99999999999997, 163, 470, 169.0, 398.0, 470.0, 470.0, 0.0698135976941566, 0.1081974409576431, 0.15701241747035416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2965266e-dd5f-4518-abea-1e70f2dffff3", 3, 0, 0.0, 1927.0, 340, 4846, 595.0, 4846.0, 4846.0, 4846.0, 0.02355083840984739, 0.02783629370643095, 0.015102588433398229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 336.75, 164, 793, 321.5, 685.9000000000001, 793.0, 793.0, 0.0871279364837343, 13.147565199604657, 0.1931662087912088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59593b30-0390-434d-9a69-2cbbfc89ddd4", 3, 0, 0.0, 490.0, 208, 721, 541.0, 721.0, 721.0, 721.0, 0.07365578197888534, 0.03332732322612325, 0.0472336883132826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/018b9e25-a006-408a-adc0-be224844cce8", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.7549312943262412, 1.410590277777778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e4ffcf0-9d26-45e1-9486-b126f4f57142", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a3cac93-e26f-4fe2-8e42-3c3d5ea3734c", 3, 0, 0.0, 326.6666666666667, 224, 499, 257.0, 499.0, 499.0, 499.0, 0.035245189031697176, 0.029382463903052235, 0.02260189531004018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 109.0, 82, 289, 84.0, 260.20000000000005, 289.0, 289.0, 0.06940877604564322, 0.05754692467065536, 0.024672650859974735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 94.94117647058823, 82, 243, 84.0, 130.9999999999999, 243.0, 243.0, 0.0855083471236501, 0.06638587496416194, 0.030395545266609994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c617c8f-c0e3-4a66-9408-90f2c29469ac", 3, 0, 0.0, 845.6666666666666, 299, 1712, 526.0, 1712.0, 1712.0, 1712.0, 0.0284050560999858, 0.028488274037778726, 0.018215481939118497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daf70fe8-e3cf-4358-b1f3-2b87d00406ce", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83040f33-0b60-489d-8b2a-ebc52bb946c3", 3, 0, 0.0, 297.3333333333333, 190, 501, 201.0, 501.0, 501.0, 501.0, 0.017628497053102907, 0.024302306321579044, 0.01130473281074633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 84.6470588235294, 80, 114, 82.0, 94.79999999999998, 114.0, 114.0, 0.10929242796343204, 0.08122220476579275, 0.0548596757550821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c44878ac-b3d2-4c26-acb0-cf906b8b8e58", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 109.05882352941177, 79, 243, 81.0, 241.4, 243.0, 243.0, 0.10929313060529108, 0.03890051914237038, 0.06179130235623132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 177.3529411764706, 80, 718, 82.0, 361.99999999999966, 718.0, 718.0, 0.10929313060529108, 5.812557509482787, 0.06369991401202225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 187.00000000000003, 80, 559, 239.0, 334.1999999999998, 559.0, 559.0, 0.10929383325618473, 1.9180791488260556, 0.06380705580093092], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.0, 0.6401137980085349], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.11111111111111, 0.35561877667140823], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 11.11111111111111, 0.35561877667140823], "isController": false}, {"data": ["401/Unauthorized", 26, 57.77777777777778, 1.8492176386913228], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1406, 45, "401/Unauthorized", 26, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
