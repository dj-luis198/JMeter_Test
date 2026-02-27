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

    var data = {"OkPercent": 99.3730407523511, "KoPercent": 0.6269592476489029};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8219594594594595, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.24545454545454545, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5220b81a-037b-4e86-b5d2-4a5b925ace0a"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f474ad36-1f8e-456d-8df3-89a5e78329fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f783f953-1e00-4113-bd40-bcf9c7b3bc56"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/80fd0e1f-1521-417a-80e3-b5eef171e400"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0deb193b-e4bc-438d-ab7c-a61eed2fc511"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/694e5750-a3c0-4414-824b-bffe537de830"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c2eebba-11d6-4387-b7b0-95194f5aa873"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/275f1c5d-7805-4d72-9300-2c597cda19c7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb0c6363-3be7-408a-8704-a1061e0ecebf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9554b7ef-7f27-434f-9bd4-294c343565b1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efa7d17f-ac11-4077-957b-63013cebc31c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0d55598b-1fd5-42cd-89c8-de5d2228019e"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98d1e659-cfe2-4493-9708-98d0114192fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9130434782608695, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5220b81a-037b-4e86-b5d2-4a5b925ace0a"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=275f1c5d-7805-4d72-9300-2c597cda19c7"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0deb193b-e4bc-438d-ab7c-a61eed2fc511"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7578484-8a0a-4fa3-ba49-7ae98086ebed"], "isController": false}, {"data": [0.4322033898305085, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80fd0e1f-1521-417a-80e3-b5eef171e400"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7454545454545455, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8aada0aa-bc0d-4530-ac92-c19593d57aa7"], "isController": false}, {"data": [0.9739884393063584, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f783f953-1e00-4113-bd40-bcf9c7b3bc56"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8aada0aa-bc0d-4530-ac92-c19593d57aa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb0c6363-3be7-408a-8704-a1061e0ecebf"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9554b7ef-7f27-434f-9bd4-294c343565b1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=694e5750-a3c0-4414-824b-bffe537de830"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efa7d17f-ac11-4077-957b-63013cebc31c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c2eebba-11d6-4387-b7b0-95194f5aa873"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d55598b-1fd5-42cd-89c8-de5d2228019e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98d1e659-cfe2-4493-9708-98d0114192fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1276, 8, 0.6269592476489029, 325.09247648902794, 97, 2616, 124.0, 798.3, 992.0, 1506.5100000000007, 5.110132158590308, 712.402519742441, 3.7402656625450543], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1476.3272727272727, 1195, 1981, 1510.0, 1716.4, 1822.0, 1981.0, 0.24219792414361013, 291.4445501269888, 1.1908853008428488], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5220b81a-037b-4e86-b5d2-4a5b925ace0a", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 787.8461538461538, 378, 1783, 777.0, 1623.3999999999999, 1783.0, 1783.0, 0.06522960822093771, 0.011784646016478002, 0.044335749337668595], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 787.8461538461538, 378, 1783, 777.0, 1623.3999999999999, 1783.0, 1783.0, 0.06420767726257977, 0.01160001981794654, 0.043641155639409686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f474ad36-1f8e-456d-8df3-89a5e78329fb", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 132.31578947368422, 99, 301, 101.0, 299.0, 301.0, 301.0, 0.10307600499104866, 0.027580884147995442, 0.05878553409645744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 123.57894736842105, 100, 298, 102.0, 296.0, 298.0, 298.0, 0.10307600499104866, 0.07660238261541799, 0.05173932281777247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 127.8421052631579, 98, 404, 100.0, 308.0, 404.0, 404.0, 0.1030737682684692, 0.027781601603610838, 0.0606967600252802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 152.73684210526315, 99, 303, 101.0, 298.0, 303.0, 303.0, 0.10307488661762472, 0.027781903033656664, 0.06059675951543954], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 233.92307692307693, 174, 397, 202.0, 396.6, 397.0, 397.0, 0.06576185104434878, 0.16305599590000153, 0.04251400917124892], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 11, 0, 0.0, 101.1818181818182, 99, 103, 101.0, 103.0, 103.0, 103.0, 0.12036591237361578, 0.08945162042609532, 0.060418045859412614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 11, 0, 0.0, 166.54545454545456, 100, 401, 102.0, 380.6000000000001, 401.0, 401.0, 0.12036722947465175, 0.06507780783918939, 0.06680894164377865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f783f953-1e00-4113-bd40-bcf9c7b3bc56", 3, 0, 0.0, 275.3333333333333, 182, 428, 216.0, 428.0, 428.0, 428.0, 0.027870421122063154, 0.027952072746444196, 0.01787263333673972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 560.75, 503, 721, 509.5, 721.0, 721.0, 721.0, 0.07075513416942317, 20.80435873737463, 0.04035253745599915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 837.75, 695, 892, 882.0, 892.0, 892.0, 892.0, 0.07054176072234762, 63.47360029715717, 0.04016195947375847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 226.25, 101, 402, 201.0, 402.0, 402.0, 402.0, 0.0715397134834475, 0.1265917586250067, 0.039612321821401106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 114.66666666666666, 99, 306, 101.0, 184.80000000000007, 306.0, 306.0, 0.11233262438965941, 0.08348156949270587, 0.056385711851840756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 140.53333333333336, 99, 304, 101.0, 301.6, 304.0, 304.0, 0.11234103743203366, 0.030060004156618386, 0.06406949791045671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 127.4, 98, 306, 100.0, 304.8, 306.0, 306.0, 0.11250618784033121, 0.030323933441339275, 0.06614133308581972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 153.8, 97, 304, 100.0, 302.2, 304.0, 304.0, 0.11234103743203366, 0.030279420245352826, 0.0661539507534339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 152.75, 100, 304, 103.5, 304.0, 304.0, 304.0, 0.0715371546096754, 0.05316384243941697, 0.0401697889653939], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80fd0e1f-1521-417a-80e3-b5eef171e400", 3, 0, 0.0, 798.3333333333333, 189, 1801, 405.0, 1801.0, 1801.0, 1801.0, 0.020126528777581733, 0.02414266228691038, 0.012906660706977869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 557.8125, 99, 912, 685.0, 909.9, 912.0, 912.0, 0.08618135789502034, 48.475046541299726, 0.04603633082868762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 11, 0, 0.0, 247.54545454545453, 100, 895, 103.0, 855.2000000000002, 895.0, 895.0, 0.11933303680881763, 19.549238946777464, 0.06829019489254602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 469.5625000000001, 100, 790, 504.5, 754.3000000000001, 790.0, 790.0, 0.08618135789502034, 15.846323658129325, 0.046120492311006976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 11, 0, 0.0, 209.63636363636363, 98, 690, 102.0, 651.8000000000002, 690.0, 690.0, 0.11984659635666346, 6.4334980770068855, 0.06870112505992329], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 592.3846153846154, 187, 1535, 410.0, 1410.6, 1535.0, 1535.0, 0.06397511860002755, 0.01155800482520029, 0.044107845441034625], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0deb193b-e4bc-438d-ab7c-a61eed2fc511", 1, 0, 0.0, 1224.0, 1224, 1224, 1224.0, 1224.0, 1224.0, 1224.0, 0.8169934640522876, 0.14760135825163398, 0.5632786968954249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 283.5333333333333, 200, 611, 204.0, 489.20000000000005, 611.0, 611.0, 0.11208333021990749, 0.17370727056542304, 0.25207803661762396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/694e5750-a3c0-4414-824b-bffe537de830", 3, 0, 0.0, 461.6666666666667, 179, 852, 354.0, 852.0, 852.0, 852.0, 0.017872249162983, 0.024638338282953448, 0.011461045198918133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 541.8421052631579, 136, 1192, 570.0, 1101.0, 1192.0, 1192.0, 0.08151322873899035, 0.05007013757502435, 0.03685607900991458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 127.8125, 99, 309, 102.0, 301.3, 309.0, 309.0, 0.08617857277511162, 0.06404481824400386, 0.0432576039125072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 226.375, 100, 312, 297.0, 308.5, 312.0, 312.0, 0.08618135789502034, 0.10396047103498425, 0.04462662599983841], "isController": false}, {"data": ["login", 19, 0, 0.0, 2411.684210526316, 1369, 4219, 2314.0, 3420.0, 4219.0, 4219.0, 0.08135895141157781, 20.603878453473385, 0.15115553128465786], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 11, 0, 0.0, 106.81818181818181, 102, 124, 104.0, 121.4, 124.0, 124.0, 0.11932009241883522, 0.09659800450704531, 0.042414564102007835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c2eebba-11d6-4387-b7b0-95194f5aa873", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 0.6766444288389513, 2.5822214419475653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/275f1c5d-7805-4d72-9300-2c597cda19c7", 2, 0, 0.0, 257.0, 211, 303, 257.0, 303.0, 303.0, 303.0, 0.07499625018749062, 0.044126211658167096, 0.046616321527673615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb0c6363-3be7-408a-8704-a1061e0ecebf", 3, 0, 0.0, 545.6666666666666, 396, 839, 402.0, 839.0, 839.0, 839.0, 0.015688571398688435, 0.021627962198387213, 0.0100607049659558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9554b7ef-7f27-434f-9bd4-294c343565b1", 3, 0, 0.0, 298.3333333333333, 174, 432, 289.0, 432.0, 432.0, 432.0, 0.10105092966855295, 0.04572291414039343, 0.06480154018458636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 710.4375, 204, 1020, 797.0, 1016.5, 1020.0, 1020.0, 0.086131253263567, 64.45188433985777, 0.17993777689852122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efa7d17f-ac11-4077-957b-63013cebc31c", 2, 0, 0.0, 287.5, 178, 397, 287.5, 397.0, 397.0, 397.0, 0.01121214499545908, 0.02217245470293422, 0.006969267860946978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d55598b-1fd5-42cd-89c8-de5d2228019e", 3, 0, 0.0, 773.0, 192, 1708, 419.0, 1708.0, 1708.0, 1708.0, 0.07726781023025808, 0.0349616719466337, 0.049549995492711066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 304.7894736842106, 202, 701, 205.0, 598.0, 701.0, 701.0, 0.10301676462295864, 0.15965586470374546, 0.23168711809245482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 990.75, 799, 1184, 990.0, 1184.0, 1184.0, 1184.0, 0.0704138574471456, 84.23945332441424, 0.15877499691939373], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1084.0476190476188, 307, 2043, 1036.0, 1743.2, 2015.8999999999996, 2043.0, 0.08529754627391885, 0.026941077673570353, 0.03848385388530323], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98d1e659-cfe2-4493-9708-98d0114192fc", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 104.73684210526316, 101, 117, 104.0, 113.0, 117.0, 117.0, 0.08838977097745129, 0.068622917897533, 0.031419801402140894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 11, 0, 0.0, 412.8181818181818, 202, 997, 395.0, 957.2000000000002, 997.0, 997.0, 0.11919726063022842, 26.078665366558663, 0.2625323898238048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 0, 0.0, 360.7391304347826, 203, 609, 399.0, 604.2, 608.2, 609.0, 0.10737778773745664, 0.1664145987688903, 0.2414951612884401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 101.33333333333333, 98, 108, 100.5, 108.0, 108.0, 108.0, 0.029249744064739434, 0.021737358626237022, 0.014682000438746162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 100.33333333333333, 98, 102, 100.5, 102.0, 102.0, 102.0, 0.02925074223758428, 0.015149066048175973, 0.016272629714854017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 235.16666666666666, 99, 910, 100.5, 910.0, 910.0, 910.0, 0.029251170046801875, 4.393279124719676, 0.01677752656981279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 200.5, 99, 700, 100.5, 700.0, 700.0, 700.0, 0.029251027442338914, 1.4400322705866293, 0.016806010232984434], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 942.8363636363638, 785, 1544, 802.0, 1298.2, 1401.3999999999999, 1544.0, 0.24687589773053717, 295.3494016345429, 0.48748346212026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5220b81a-037b-4e86-b5d2-4a5b925ace0a", 3, 0, 0.0, 548.3333333333334, 238, 1056, 351.0, 1056.0, 1056.0, 1056.0, 0.018158597187838584, 0.025033092151854293, 0.01164467332683659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1084.0476190476188, 307, 2043, 1036.0, 1743.2, 2015.8999999999996, 2043.0, 0.08799386557051452, 0.027792705308544205, 0.03970035731794698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 182.0, 101, 304, 102.0, 304.0, 304.0, 304.0, 0.04134315646730997, 0.01114327264157964, 0.024345628271277255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 140.0, 99, 301, 100.0, 301.0, 301.0, 301.0, 0.041411982971392605, 0.011161823535258162, 0.024345716551541354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 214.89473684210526, 99, 885, 103.0, 693.0, 885.0, 885.0, 0.09387490921308123, 8.914092337707576, 0.05433898167957035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=275f1c5d-7805-4d72-9300-2c597cda19c7", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 172.89473684210526, 99, 686, 102.0, 489.0, 686.0, 686.0, 0.09387537303108756, 2.928162797189668, 0.05443092532708157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 102.05263157894737, 100, 106, 101.0, 105.0, 106.0, 106.0, 0.09387490921308123, 0.06976445889761212, 0.04712080403859741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 141.8, 100, 306, 101.0, 306.0, 306.0, 306.0, 0.041341447281386424, 0.011062066948339727, 0.023577544152665695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 163.94736842105263, 98, 310, 101.0, 303.0, 310.0, 310.0, 0.09387490921308123, 0.039960526218273985, 0.05270813673127566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 145.6, 100, 305, 105.0, 305.0, 305.0, 305.0, 0.041410611054976725, 0.030774877942223916, 0.020786185627205113], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 531.6363636363636, 351, 1801, 411.0, 1543.200000000001, 1801.0, 1801.0, 0.05825253001329217, 0.010524138723104542, 0.03965040372975063], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 111.2, 105, 118, 112.0, 118.0, 118.0, 118.0, 0.043352350564447605, 0.03412304155756325, 0.015410405864705984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1278.3157894736842, 706, 2616, 1135.0, 1771.0, 2616.0, 2616.0, 0.08153736557063282, 0.04220195678948769, 0.0375040031091485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 329.6, 204, 612, 208.0, 612.0, 612.0, 612.0, 0.04130558699369676, 0.06401559234277028, 0.09289723324851919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0deb193b-e4bc-438d-ab7c-a61eed2fc511", 3, 0, 0.0, 305.0, 200, 512, 203.0, 512.0, 512.0, 512.0, 0.018308423705747014, 0.025239640102161003, 0.011740753483177609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7578484-8a0a-4fa3-ba49-7ae98086ebed", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["addBook", 59, 3, 5.084745762711864, 973.2033898305082, 524, 1681, 837.0, 1433.0, 1548.0, 1681.0, 0.2608069100569797, 80.28983635609647, 0.949828237652561], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80fd0e1f-1521-417a-80e3-b5eef171e400", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 188.23636363636362, 99, 707, 104.0, 404.4, 408.2, 707.0, 0.24786163011834264, 0.1842018559766199, 0.11981592471540979], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 561.2727272727271, 488, 805, 501.0, 708.6, 764.1999999999998, 805.0, 0.2481423163859651, 72.96208011782248, 0.12479813763551954], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 153.72727272727275, 98, 419, 104.0, 304.0, 326.3999999999996, 419.0, 0.24835633263492524, 0.43947429173289504, 0.1207826695822195], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 747.8181818181819, 681, 998, 692.0, 902.4, 985.1999999999999, 998.0, 0.24769753878718279, 222.87868080653698, 0.12433255364903512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 115.6086956521739, 101, 304, 106.0, 122.20000000000002, 268.1999999999995, 304.0, 0.1133267308194508, 0.0846630362078905, 0.040284111345976654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8aada0aa-bc0d-4530-ac92-c19593d57aa7", 3, 0, 0.0, 288.3333333333333, 245, 359, 261.0, 359.0, 359.0, 359.0, 0.026470432526867486, 0.026547982622161046, 0.016974854192034164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 3, 1.7341040462427746, 168.78612716763013, 101, 1122, 108.0, 302.6, 382.29999999999995, 994.7199999999984, 0.7347164122056357, 1.5248583919053786, 0.3551607656658102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 176.5, 106, 302, 123.0, 302.0, 302.0, 302.0, 0.029770174254753305, 0.023054441585956414, 0.010582366629619339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f783f953-1e00-4113-bd40-bcf9c7b3bc56", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8aada0aa-bc0d-4530-ac92-c19593d57aa7", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 119.94736842105263, 101, 335, 105.0, 157.0, 335.0, 335.0, 0.10234146499113939, 0.08305249746839534, 0.03637919263356908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb0c6363-3be7-408a-8704-a1061e0ecebf", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 338.1666666666667, 201, 1009, 203.5, 1009.0, 1009.0, 1009.0, 0.029235206985265456, 5.867002610155824, 0.06450398207881812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 349.63157894736844, 203, 986, 211.0, 795.0, 986.0, 986.0, 0.09382762384011772, 11.945945373495672, 0.20849350644941456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9554b7ef-7f27-434f-9bd4-294c343565b1", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=694e5750-a3c0-4414-824b-bffe537de830", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 106.66666666666667, 100, 118, 105.0, 116.8, 118.0, 118.0, 0.10965713867972804, 0.09091690501864172, 0.038979686015059585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efa7d17f-ac11-4077-957b-63013cebc31c", 1, 0, 0.0, 1114.0, 1114, 1114, 1114.0, 1114.0, 1114.0, 1114.0, 0.8976660682226212, 0.16217599865350088, 0.6188986759425493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c2eebba-11d6-4387-b7b0-95194f5aa873", 3, 0, 0.0, 340.3333333333333, 236, 411, 374.0, 411.0, 411.0, 411.0, 0.06353374700861941, 0.028747365996738602, 0.04074266979393888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d55598b-1fd5-42cd-89c8-de5d2228019e", 1, 0, 0.0, 1535.0, 1535, 1535, 1535.0, 1535.0, 1535.0, 1535.0, 0.6514657980456027, 0.11769645765472313, 0.4491551302931596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 104.625, 101, 109, 104.5, 109.0, 109.0, 109.0, 0.08650238422196513, 0.06715761275045143, 0.03074889439140166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98d1e659-cfe2-4493-9708-98d0114192fc", 3, 0, 0.0, 255.66666666666666, 186, 379, 202.0, 379.0, 379.0, 379.0, 0.024669835369965296, 0.024742110278275744, 0.015820174374619675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 23, 0, 0.0, 136.7826086956522, 100, 307, 102.0, 301.4, 306.2, 307.0, 0.10752939526403142, 0.07991198222258585, 0.053974715982140764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 23, 0, 0.0, 178.69565217391306, 98, 306, 102.0, 304.6, 305.8, 306.0, 0.10753593102738894, 0.028774262794438055, 0.06132908566405775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 23, 0, 0.0, 161.1304347826087, 98, 304, 102.0, 302.2, 303.8, 304.0, 0.10743697420111267, 0.02895762195264365, 0.063161189911201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 23, 0, 0.0, 186.56521739130434, 99, 303, 101.0, 302.2, 303.0, 303.0, 0.10743546865219869, 0.02895721616016293, 0.06326522226296466], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 62.5, 0.39184952978056425], "isController": false}, {"data": ["401/Unauthorized", 3, 37.5, 0.23510971786833856], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1276, 8, "406/Not Acceptable", 5, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
