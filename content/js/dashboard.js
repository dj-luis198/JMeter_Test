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

    var data = {"OkPercent": 98.96907216494846, "KoPercent": 1.0309278350515463};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7967786154900617, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.17592592592592593, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f923e84-9b14-4d0d-85a2-efd2317148f9"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a67e189-cd8e-466b-a6dc-d63543503da3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e989656-fe7a-4d76-a8ac-003ef5a94be6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d385c0f-9c43-45fb-bf9c-37d67d341e6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc4ec12d-5b40-4224-bd3d-000e30822f90"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/991a7a15-9309-41c9-81ec-f034b5c71288"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/851aa7b2-0f5c-4a5b-9a25-e5b872255b1e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5eea0324-f9cb-4407-8211-45fd11195e53"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de89574d-12b6-43e8-b477-d57c9f37d045"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c781b21-8df1-4dda-ab42-af1ffca71425"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c0e0873-913a-4570-9296-dcc7e55000dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5d8aab6-c332-4274-a6b9-cc84c5a1eeec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ae3fa4e-2b39-433b-929a-9ea7cf982d39"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7e989656-fe7a-4d76-a8ac-003ef5a94be6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1614f756-1601-43a3-9f4b-d7e7d9e35c7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a67e189-cd8e-466b-a6dc-d63543503da3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6018518518518519, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=851aa7b2-0f5c-4a5b-9a25-e5b872255b1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cdb3ec5f-b46c-44b4-a1c6-477be778862d"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9593023255813954, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=991a7a15-9309-41c9-81ec-f034b5c71288"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5d8aab6-c332-4274-a6b9-cc84c5a1eeec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5eea0324-f9cb-4407-8211-45fd11195e53"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f923e84-9b14-4d0d-85a2-efd2317148f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85b7c43f-8ea4-4c37-a93f-98cb44c477b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de89574d-12b6-43e8-b477-d57c9f37d045"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c781b21-8df1-4dda-ab42-af1ffca71425"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c0e0873-913a-4570-9296-dcc7e55000dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1261, 13, 1.0309278350515463, 353.8302934179223, 90, 3031, 113.0, 1001.5999999999999, 1205.8999999999999, 1688.999999999994, 5.0626914568587225, 694.9020118213946, 3.7046384627043043], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1653.1851851851852, 1267, 2378, 1616.5, 2009.0, 2310.75, 2378.0, 0.2375641753223614, 285.8695096279481, 1.1681011940899313], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7f923e84-9b14-4d0d-85a2-efd2317148f9", 3, 0, 0.0, 306.3333333333333, 200, 460, 259.0, 460.0, 460.0, 460.0, 0.017739827687140396, 0.024455784588229036, 0.011376126479058134], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 555.818181818182, 116, 1077, 496.0, 1062.2, 1077.0, 1077.0, 0.0722600310061224, 0.013805361037391281, 0.04879989842538823], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 555.818181818182, 116, 1077, 496.0, 1062.2, 1077.0, 1077.0, 0.07263602746962494, 0.01387719558901215, 0.04905382288365029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 108.6, 91, 280, 97.0, 173.20000000000005, 280.0, 280.0, 0.10422746602184607, 0.027888989931626782, 0.05944222671558409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 112.53333333333333, 93, 294, 101.0, 181.20000000000007, 294.0, 294.0, 0.10422384502609071, 0.07745541607895999, 0.05231548471036194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a67e189-cd8e-466b-a6dc-d63543503da3", 3, 0, 0.0, 332.3333333333333, 191, 583, 223.0, 583.0, 583.0, 583.0, 0.029015784586815228, 0.02418926573139121, 0.01860712748568555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 215.1333333333333, 93, 307, 282.0, 306.4, 307.0, 307.0, 0.10422601759335177, 0.028092168804458095, 0.061375281844522574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 136.13333333333333, 94, 302, 100.0, 292.4, 302.0, 302.0, 0.10422891449059855, 0.028092949608794143, 0.061275201682949546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e989656-fe7a-4d76-a8ac-003ef5a94be6", 1, 0, 0.0, 1206.0, 1206, 1206, 1206.0, 1206.0, 1206.0, 1206.0, 0.8291873963515755, 0.1498043635986733, 0.5716858416252073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d385c0f-9c43-45fb-bf9c-37d67d341e6a", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.9046343838526912, 1.6903107294617565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc4ec12d-5b40-4224-bd3d-000e30822f90", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 205.0, 99, 344, 198.0, 322.20000000000005, 344.0, 344.0, 0.07235366471311772, 0.18295893395097051, 0.04676909026777434], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 114.0625, 94, 309, 102.0, 171.10000000000014, 309.0, 309.0, 0.08698535927671674, 0.06464439297810687, 0.04366257291819571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 128.74999999999997, 92, 398, 98.5, 321.00000000000006, 398.0, 398.0, 0.08698866972576821, 0.023276265141465326, 0.04961072570297719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 752.25, 655, 853, 750.5, 853.0, 853.0, 853.0, 0.028316980277223236, 8.326132413739398, 0.016149527814353876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1072.5, 958, 1177, 1077.5, 1177.0, 1177.0, 1177.0, 0.028252178949301467, 25.421360280614767, 0.016084980788518315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 102.5, 96, 108, 103.0, 108.0, 108.0, 108.0, 0.02846853515152378, 0.05037596259234481, 0.015763339288001936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 124.88235294117646, 91, 300, 102.0, 298.4, 300.0, 300.0, 0.08218158262391291, 0.06107439880546652, 0.04125130221551878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 120.6470588235294, 90, 308, 99.0, 280.0, 308.0, 308.0, 0.08218476101154938, 0.021990844255043485, 0.04687099651439925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 153.70588235294116, 94, 308, 100.0, 291.2, 308.0, 308.0, 0.08210022022176718, 0.022128574981648188, 0.04826594977881235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 143.94117647058823, 93, 303, 97.0, 300.6, 303.0, 303.0, 0.08218436369965, 0.022151254278421285, 0.04839567510828999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 99.25, 95, 101, 100.5, 101.0, 101.0, 101.0, 0.028469548259442992, 0.02115754514202746, 0.015986318602714572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 135.75, 95, 297, 102.0, 297.0, 297.0, 297.0, 0.08698914266763079, 0.02344629235963486, 0.05114010145108763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 688.5882352941177, 92, 1231, 931.0, 1222.2, 1231.0, 1231.0, 0.0835064864891417, 44.208846268856504, 0.04487130483797286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 122.43749999999999, 91, 301, 101.0, 281.40000000000003, 301.0, 301.0, 0.08698772385747061, 0.023445909945958878, 0.051224216294975373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 512.7647058823528, 91, 922, 751.0, 919.6, 922.0, 922.0, 0.08350525591904902, 14.452395864033795, 0.044952191705963256], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 673.7272727272727, 101, 2694, 409.0, 2396.400000000001, 2694.0, 2694.0, 0.07253305199301045, 0.013857522007187366, 0.04953806542810985], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/991a7a15-9309-41c9-81ec-f034b5c71288", 3, 0, 0.0, 455.66666666666663, 198, 935, 234.0, 935.0, 935.0, 935.0, 0.040616834323932795, 0.033860583562367146, 0.02604660274028242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 316.8235294117647, 189, 592, 224.0, 589.6, 592.0, 592.0, 0.08205900525177633, 0.12717543099079007, 0.18455262606918058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/851aa7b2-0f5c-4a5b-9a25-e5b872255b1e", 3, 0, 0.0, 1029.3333333333333, 188, 2371, 529.0, 2371.0, 2371.0, 2371.0, 0.01843850451436052, 0.02541896699815, 0.011824171189222079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5eea0324-f9cb-4407-8211-45fd11195e53", 3, 0, 0.0, 668.0, 235, 1054, 715.0, 1054.0, 1054.0, 1054.0, 0.06330983834887942, 0.028646053159160932, 0.040599082534925925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 514.45, 160, 1252, 426.0, 945.9000000000002, 1237.1, 1252.0, 0.08989774131924935, 0.05522038993145297, 0.040647123272277784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 100.94117647058823, 95, 105, 102.0, 105.0, 105.0, 105.0, 0.08350238472986979, 0.062055971464288, 0.04191428296011042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 135.8235294117647, 96, 313, 102.0, 298.59999999999997, 313.0, 313.0, 0.0835036152153411, 0.09611933833208897, 0.04349786206185162], "isController": false}, {"data": ["login", 20, 0, 0.0, 2685.9500000000003, 1571, 4180, 2592.0, 3947.6, 4168.5, 4180.0, 0.08528166401582828, 20.52361542553418, 0.15695490625413083], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 105.31249999999999, 95, 120, 104.0, 116.5, 120.0, 120.0, 0.0891454296252549, 0.07216949331966437, 0.031688414437102325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de89574d-12b6-43e8-b477-d57c9f37d045", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 792.1176470588235, 198, 1330, 1026.0, 1325.2, 1330.0, 1330.0, 0.08346016004713044, 58.78700572100987, 0.1751426416981688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c781b21-8df1-4dda-ab42-af1ffca71425", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 816.0, 99, 1278, 1083.5, 1278.0, 1278.0, 1278.0, 0.04234955321221361, 33.780303090458645, 0.07301575800406555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 342.99999999999994, 198, 592, 388.0, 481.00000000000006, 592.0, 592.0, 0.10415147790947153, 0.1614144486741517, 0.234239114868665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c0e0873-913a-4570-9296-dcc7e55000dc", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5d8aab6-c332-4274-a6b9-cc84c5a1eeec", 3, 0, 0.0, 324.0, 213, 434, 325.0, 434.0, 434.0, 434.0, 0.027650788969178587, 0.023051325048849727, 0.017731788499115175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ae3fa4e-2b39-433b-929a-9ea7cf982d39", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1193.9523809523812, 204, 3031, 1205.0, 2038.8000000000002, 2938.799999999999, 3031.0, 0.08972633467922836, 0.028339902582836637, 0.040481998654104984], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 282.4375, 194, 708, 207.5, 493.10000000000025, 708.0, 708.0, 0.08693809464298329, 0.13473706660001414, 0.1955258124636626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 130.60000000000002, 92, 439, 105.0, 253.6000000000001, 439.0, 439.0, 0.08384619254439656, 0.06509543268827662, 0.029804701256015965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 458.1052631578948, 195, 1327, 387.0, 1252.0, 1327.0, 1327.0, 0.11769734437623504, 22.38628171633701, 0.2599492488276725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e989656-fe7a-4d76-a8ac-003ef5a94be6", 3, 0, 0.0, 762.6666666666666, 198, 1542, 548.0, 1542.0, 1542.0, 1542.0, 0.016962377446822947, 0.0233840066690414, 0.01087756626635456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 98.75, 94, 104, 98.5, 104.0, 104.0, 104.0, 0.17283097131005876, 0.12844176676460423, 0.08675304614586934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 97.25, 95, 102, 96.0, 102.0, 102.0, 102.0, 0.17289820618111088, 0.046263777825805055, 0.09860600821266478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 97.0, 94, 99, 97.5, 99.0, 99.0, 99.0, 0.17291315436821855, 0.04660549863830891, 0.10165402239225349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 154.5, 92, 323, 101.5, 323.0, 323.0, 323.0, 0.17285337712285553, 0.04658938680264466, 0.10178768203621279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 2.9200185643564356, 6.120436262376237], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1134.2222222222224, 772, 1951, 1048.5, 1540.5, 1680.25, 1951.0, 0.24745556110548483, 296.0428805545754, 0.48862807085477566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1193.9523809523812, 204, 3031, 1205.0, 2038.8000000000002, 2938.799999999999, 3031.0, 0.08956598880851645, 0.02828925762590419, 0.04040965510696738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 118.2, 95, 299, 98.0, 279.50000000000006, 299.0, 299.0, 0.05961962678113635, 0.01606935253085316, 0.03510804194240744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 139.0, 95, 306, 100.0, 304.7, 306.0, 306.0, 0.059619271333265764, 0.016069256726544287, 0.035049610686158195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 170.39999999999998, 95, 969, 97.0, 568.8000000000002, 969.0, 969.0, 0.0847007803765232, 5.102234944789208, 0.04930952982596813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 198.20000000000005, 91, 838, 103.0, 514.6000000000001, 838.0, 838.0, 0.08470173695028572, 1.681649315751135, 0.049392803246335236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1614f756-1601-43a3-9f4b-d7e7d9e35c7d", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 99.66666666666666, 95, 105, 99.0, 104.4, 105.0, 105.0, 0.08469743253849497, 0.06294408804862762, 0.04251414094217424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 118.5, 92, 305, 99.0, 284.9000000000001, 305.0, 305.0, 0.05961713873504355, 0.015952242200587826, 0.03400039943482953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 156.66666666666669, 94, 399, 100.0, 336.00000000000006, 399.0, 399.0, 0.08469886729381472, 0.031144479327829787, 0.047830597324645105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 120.2, 95, 287, 101.5, 269.50000000000006, 287.0, 287.0, 0.05961607249314415, 0.04430452262429951, 0.029924473888160247], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 559.6363636363636, 108, 935, 548.0, 918.8000000000001, 935.0, 935.0, 0.07148148629504959, 0.013478930831914534, 0.0486485328424938], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 147.4, 98, 309, 110.0, 308.5, 309.0, 309.0, 0.05983366241847663, 0.047095636630168136, 0.021268997187817867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1511.85, 1043, 2732, 1384.5, 2510.2000000000016, 2724.35, 2732.0, 0.08798247389120087, 0.0455378038694692, 0.040468501174566025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 262.0, 193, 586, 205.0, 568.3000000000001, 586.0, 586.0, 0.05957984294753399, 0.09233711988060199, 0.13399646319157302], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 1058.5762711864409, 551, 2282, 853.0, 1915.0, 2091.0, 2282.0, 0.28300076745970837, 81.34901935287557, 1.0322108235801997], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a67e189-cd8e-466b-a6dc-d63543503da3", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 183.46296296296293, 95, 420, 103.0, 411.0, 416.0, 420.0, 0.2483123953869075, 0.18453684852484045, 0.1200338239419133], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 629.148148148148, 454, 903, 594.5, 807.0, 821.0, 903.0, 0.24820054604120131, 72.97920156986845, 0.12482742305783072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=851aa7b2-0f5c-4a5b-9a25-e5b872255b1e", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 152.35185185185188, 95, 387, 103.0, 295.5, 303.75, 387.0, 0.24866572419287253, 0.4400217697631689, 0.12093313539848682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdb3ec5f-b46c-44b4-a1c6-477be778862d", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.7274167141230068, 1.359179242596811], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 948.0185185185184, 673, 1536, 938.5, 1169.5, 1268.0, 1536.0, 0.24792136301656023, 223.0800782415718, 0.12444490292042183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 136.42105263157896, 99, 333, 104.0, 289.0, 333.0, 333.0, 0.11544257035920867, 0.08624371711405726, 0.04103622618237496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 4, 2.3255813953488373, 180.59302325581402, 92, 1720, 108.5, 314.9000000000001, 440.8499999999999, 1155.710000000008, 0.7387998797302522, 1.4839798615287143, 0.3580533415123921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=991a7a15-9309-41c9-81ec-f034b5c71288", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 149.5, 101, 286, 105.5, 286.0, 286.0, 286.0, 0.1571030203055654, 0.12166278818585288, 0.05584521424924394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 110.46666666666665, 97, 150, 105.0, 140.4, 150.0, 150.0, 0.10111496096962506, 0.08205716070874847, 0.03594320878217141], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5d8aab6-c332-4274-a6b9-cc84c5a1eeec", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 255.0, 191, 428, 200.5, 428.0, 428.0, 428.0, 0.17207261464337953, 0.26667894476469073, 0.38699534328486623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5eea0324-f9cb-4407-8211-45fd11195e53", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 330.53333333333336, 194, 1068, 207.0, 727.2000000000003, 1068.0, 1068.0, 0.08464867976275797, 6.873726301896695, 0.18893298751996299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f923e84-9b14-4d0d-85a2-efd2317148f9", 1, 0, 0.0, 2694.0, 2694, 2694, 2694.0, 2694.0, 2694.0, 2694.0, 0.3711952487008166, 0.06706164161098738, 0.2559217242019302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 104.94117647058822, 95, 123, 104.0, 121.4, 123.0, 123.0, 0.08095739260049431, 0.06712190070099577, 0.028777823150956963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85b7c43f-8ea4-4c37-a93f-98cb44c477b3", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 108.88235294117645, 99, 187, 104.0, 126.99999999999994, 187.0, 187.0, 0.0816746179309417, 0.06340949341318228, 0.029032774342639435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de89574d-12b6-43e8-b477-d57c9f37d045", 3, 0, 0.0, 345.6666666666667, 194, 433, 410.0, 433.0, 433.0, 433.0, 0.032408957835945856, 0.03250390595460585, 0.020783088195577257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c781b21-8df1-4dda-ab42-af1ffca71425", 3, 0, 0.0, 331.6666666666667, 195, 557, 243.0, 557.0, 557.0, 557.0, 0.017176228100309172, 0.02367881705885721, 0.011014703566930035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 111.10526315789474, 92, 306, 100.0, 107.0, 306.0, 306.0, 0.1177724883467222, 0.08752428089048399, 0.059116268564663295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c0e0873-913a-4570-9296-dcc7e55000dc", 3, 0, 0.0, 466.66666666666663, 202, 854, 344.0, 854.0, 854.0, 854.0, 0.01973385606125389, 0.02720471367819343, 0.012654849101780653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 154.57894736842107, 95, 381, 101.0, 305.0, 381.0, 381.0, 0.1177724883467222, 0.05944314533125062, 0.06560537770876723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 298.9473684210526, 90, 1227, 103.0, 1153.0, 1227.0, 1227.0, 0.1177746784441345, 16.759446914225943, 0.06764053540988688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 272.7368421052632, 96, 879, 104.0, 849.0, 879.0, 879.0, 0.11776956834354002, 5.49433534187266, 0.06775260991309846], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.3965107057890563], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07930214115781126], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.07930214115781126], "isController": false}, {"data": ["401/Unauthorized", 6, 46.15384615384615, 0.47581284694686754], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1261, 13, "401/Unauthorized", 6, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
